import { CreditService } from '@app/credit/credit.service';
import { InvoiceStatusEnum } from '@app/invoice/invoice.constant';
import { InvoiceService } from '@app/invoice/invoice.service';
import { PaymentMethodEnum, PaymentTypeEnum } from '@app/payment-method/payment-method-enum';
import { ErrorBase } from '@common/exceptions';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTransactionInStore, PayTransactionOrder } from '@schemas';
import { isEmpty, omitBy } from 'lodash';
import { Brackets, DeleteResult, EntityManager, Repository, Connection } from 'typeorm';
import { TransactionEntity } from './transaction.entity';

export interface GetWhereTransactionOptions {
  storeId?: number;
  staffId?: number;
  customerId?: number;
}

export interface GetTransactionOptions extends GetWhereTransactionOptions {
  fail?: boolean;
}

export interface GetManyTransactionOptions extends GetWhereTransactionOptions {
  globalSearch?: string;
  columnSearch?: { [x: string]: any };
  createdDateRange?: string[];
}

export type CreateTransaction = Pick<
  TransactionEntity,
  | 'gateway'
  | 'transactionId'
  | 'description'
  | 'fees'
  | 'amountIn'
  | 'amountOut'
  | 'invoiceId'
  | 'storeId'
  | 'staffId'
> &
  Partial<Pick<TransactionEntity, 'refundId'>>;

export type UpdateTransaction = Partial<CreateTransaction>;

export interface CreateTransactionOptions {
  entityManager?: EntityManager;
}

export type UpdateTransactionOptions = CreateTransactionOptions;

@Injectable()
export class TransactionService {
  constructor(
    private connection: Connection,
    @InjectRepository(TransactionEntity)
    private readonly transactionRepository: Repository<TransactionEntity>,
    private readonly invoiceService: InvoiceService,
    private readonly creditService: CreditService,
  ) {}

  get repository(): Repository<TransactionEntity> {
    return this.transactionRepository;
  }

  async get(
    transactionId: number,
    options: GetTransactionOptions = {},
  ): Promise<TransactionEntity> {
    const query = this.transactionRepository.createQueryBuilder('transaction');
    query.where('transaction.id = :transactionId', { transactionId });

    if ('storeId' in options) {
      query.andWhere('transaction.storeId = :storeId', { storeId: options.storeId });
    }
    if ('staffId' in options) {
      query.andWhere('transaction.staffId = :staffId', { staffid: options.staffId });
    }
    if ('customerId' in options) {
      query.andWhere('transaction.customerId = :customerId', { customerId: options.customerId });
    }

    const entity = await query.getOne();

    if (options?.fail === true && !entity) {
      throw new NotFoundException(
        new ErrorBase('Ups... Someting was wrong', {
          devMessage: `Transaction #${transactionId} doest not exist`,
        }),
      );
    }

    return entity;
  }

  getMany(options: GetManyTransactionOptions = {}): Promise<TransactionEntity[]> {
    const query = this.transactionRepository.createQueryBuilder('transaction');
    if ('storeId' in options) {
      query.andWhere('transaction.storeId = :storeId', { storeId: options.storeId });
    }
    if ('staffId' in options) {
      query.andWhere('transaction.staffId = :staffId', { staffid: options.staffId });
    }
    if ('customerId' in options) {
      query.andWhere('transaction.customerId = :customerId', { customerId: options.customerId });
    }

    if (options?.columnSearch) {
      query.andWhere(
        new Brackets(qb => {
          // eslint-disable-next-line no-restricted-syntax
          for (const [key, value] of Object.entries(options.columnSearch)) {
            if (!isEmpty(value)) {
              qb.andWhere(`transaction.${key} = :value`, { key, value: String(value) });
            }
          }
        }),
      );
    }

    if (!isEmpty(options?.globalSearch)) {
      query.andWhere(
        new Brackets(qb => {
          qb.where('transaction.description LIKE :name', { name: `%${options.globalSearch}%` });
        }),
      );
    }

    return query.getMany();
  }

  async create(data: CreateTransaction) {
    const entity = this.transactionRepository.create();
    // Solve object key ordering issues
    const insert = { id: undefined, ...data };
    Object.assign(entity, insert);
    return this.transactionRepository.save(entity);
  }

  async payTransactionOrder(data: PayTransactionOrder) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    let transactionSave: TransactionEntity;
    try {
      const invoice = await this.invoiceService.getOrFail(data.invoiceId);
      // cek status paid
      if (invoice.status === InvoiceStatusEnum.Paid) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_IMPLEMENTED,
            error: 'Order has already been purchased',
          },
          HttpStatus.NOT_IMPLEMENTED,
        );
      }

      // cek if money more than or equal to total required;
      if (data.amountIn < invoice.total) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_IMPLEMENTED,
            error: `Amount less than ${invoice.total}`,
          },
          HttpStatus.NOT_IMPLEMENTED,
        );
      }
      transactionSave = this.transactionRepository.create({
        amountIn: data.amountIn,
        invoiceId: data.invoiceId,
        staffId: data.staffId,
        gateway: PaymentMethodEnum.BankTransfer,
        description: `pay invoice ${invoice.id}`,
      });

      transactionSave = await queryRunner.manager.save(transactionSave);

      if (data.amountIn > invoice.total) {
        await this.creditService.create(
          {
            description: `invoice id ${invoice.id}`,
            total: invoice.total,
            storeId: data.storeId,
            adminId: data.staffId,
            invoiceId: invoice.id,
            transactionId: transactionSave.id,
          },
          { entityManager: queryRunner.manager },
        );
      }

      invoice.paidDate = new Date();
      invoice.status = InvoiceStatusEnum.Paid;

      /* TODO:  ada 2 metode pembayaran di toko . yang pertama langsung ke manager , 
      yang kedua ke rekening velnus...

        apabila ke manager, maka tidak menambahkan deposit toko.
      tapi apabila ke rekening velnus akan menambahkan deposit pada manager itu sendiri 
      karena nanti akan diserah kan ke velnus oleh manager itu sendiri */
      if (invoice.paymentMethod === PaymentTypeEnum.ToVelnus) {
        await this.creditService.create(
          {
            description: `invoice id ${invoice.id}`,
            total: invoice.total,
            storeId: data.storeId,
            adminId: data.staffId,
            invoiceId: invoice.id,
          },
          { entityManager: queryRunner.manager },
        );
      }
      await queryRunner.manager.save(invoice);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    }
    const entity = this.transactionRepository.create();
    // Solve object key ordering issues
    const insert = { id: undefined, ...data };
    Object.assign(entity, insert);
    return this.transactionRepository.save(entity);
  }

  async update(transactionId: number, data: UpdateTransaction) {
    const currentEntity = await this.get(transactionId);
    if (!currentEntity) {
      throw new BadRequestException(`Transaction #"${transactionId}" doest not exits`);
    }

    // copy entity
    const newEntity = this.transactionRepository.create(currentEntity);
    Object.assign(newEntity, omitBy(data, isEmpty));

    return this.transactionRepository.save(currentEntity);
  }

  delete(transactionId: number): Promise<DeleteResult> {
    return this.transactionRepository.delete(transactionId);
  }
}
