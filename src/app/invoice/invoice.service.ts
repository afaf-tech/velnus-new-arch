import { ErrorBase } from '@common/exceptions';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InvoiceEntity } from './invoice.entity';

export interface GetWhereInvoiceOptions {
  storeId?: number;
  customerId?: number;
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
  'customerId' | 'subtotal' | 'total' | 'orderId' | 'storeId'
> &
  Partial<
    Pick<
      InvoiceEntity,
      'date' | 'dueDate' | 'paidDate' | 'dateRefunded' | 'dateCancelled' | 'notes'
    >
  >;

@Injectable()
export class InvoiceService {
  constructor(
    @InjectRepository(InvoiceEntity)
    private readonly invoiceRepository: Repository<InvoiceEntity>,
  ) {}

  get repository(): Repository<InvoiceEntity> {
    return this.invoiceRepository;
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

  async getMany() {
    return this.repository.find();
  }
}
