import { ErrorBase } from '@common/exceptions';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isEmpty, omitBy } from 'lodash';
import { Brackets, DeleteResult, EntityManager, Repository } from 'typeorm';
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
    @InjectRepository(TransactionEntity)
    private readonly transactionRepository: Repository<TransactionEntity>,
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

  create(data: CreateTransaction) {
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
