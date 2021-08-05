import { ErrorBase } from '@common/exceptions';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { endOfDay, parseISO, startOfDay } from 'date-fns';
import { isEmpty } from 'lodash';
import { Brackets, EntityManager, EntityNotFoundError, FindOneOptions, Repository } from 'typeorm';
import { InvoiceItemEntity } from './invoice-item.entity';
import { InvoiceEntity } from './invoice.entity';

export interface GetWhereInvoiceOptions {
  storeId?: number;
  customerId?: number;
  item?: number;
}

export interface GetInvoiceOptions extends GetWhereInvoiceOptions {
  fail?: boolean;
}

export interface GetManyInvoiceOptions extends GetWhereInvoiceOptions {
  globalSearch?: string;
  columnSearch?: { [x: string]: any };
  createdDateRange?: string[];
}

export type CreateInvoice = Pick<
  InvoiceEntity,
  'customerId' | 'subtotal' | 'total' | 'orderId' | 'storeId' | 'invoiceItems'
> &
  Partial<
    Pick<
      InvoiceEntity,
      'date' | 'dueDate' | 'paidDate' | 'dateRefunded' | 'dateCancelled' | 'notes' | 'status'
    >
  >;

@Injectable()
export class InvoiceService {
  constructor(
    @InjectRepository(InvoiceEntity)
    private readonly invoiceRepository: Repository<InvoiceEntity>,
    @InjectRepository(InvoiceItemEntity)
    private readonly invoiceItemRepository: Repository<InvoiceItemEntity>,
  ) {}

  get repository(): Repository<InvoiceEntity> {
    return this.invoiceRepository;
  }

  get invoiceItemRepo(): Repository<InvoiceItemEntity> {
    return this.invoiceItemRepository;
  }

  async get(invoiceId: number, options: GetInvoiceOptions): Promise<InvoiceEntity> {
    const query = this.repository.createQueryBuilder('invoice');

    if ('storeId' in options) {
      query.andWhere('transaction.storeId = :storeId', { storeId: options.storeId });
    }
    if ('customerId' in options) {
      query.andWhere('transaction.customerId = :customerId', { customerId: options.customerId });
    }

    const entity = await query.getOne();

    if (options?.fail === true && !entity) {
      throw new NotFoundException(
        new ErrorBase('Ups... Someting was wrong', {
          devMessage: `Invoice #${invoiceId} doest not exist`,
        }),
      );
    }

    return entity;
  }

  getOrFail(invoiceId: number, storeId?: number): Promise<InvoiceEntity> {
    let param = {};
    if (storeId) {
      param = { id: invoiceId, storeId };
    } else {
      param = { id: invoiceId };
    }
    const queries: FindOneOptions<InvoiceEntity> = {
      where: param,
      relations: ['invoiceItems'],
    };

    try {
      return this.invoiceRepository.findOneOrFail(queries);
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw new NotFoundException(
          new ErrorBase('Ups... Someting was wrong', {
            devMessage: `Store #${invoiceId} doest not exist`,
          }),
        );
      } else {
        throw error;
      }
    }
  }

  getMany(options: GetManyInvoiceOptions = {}): Promise<InvoiceEntity[]> {
    const query = this.invoiceRepository.createQueryBuilder('invoice');

    if (options.storeId) {
      query.leftJoinAndSelect('invoice.invoiceItems', 'invoice');
      query.where('invoice.product.storeId = :storeId', { storeId: options.storeId });
    }

    if (options?.columnSearch) {
      query.andWhere(
        new Brackets(qb => {
          // eslint-disable-next-line no-restricted-syntax
          for (const [key, value] of Object.entries(options.columnSearch)) {
            if (!isEmpty(value)) {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              qb.andWhere(`invoice.${key} = :value`, { key, value });
            }
          }
        }),
      );
    }

    if (options?.createdDateRange && options?.createdDateRange.length) {
      const range = options.createdDateRange;
      const startDate = startOfDay(parseISO(range[0]));
      const endDate = endOfDay(parseISO(range[1]));

      query.andWhere('invoice.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate });
    }

    return query.getMany();
  }

  async create(data: CreateInvoice, entityManager: EntityManager): Promise<InvoiceEntity> {
    const entity = this.invoiceRepository.create(data);
    return entityManager.save(entity);
  }
}
