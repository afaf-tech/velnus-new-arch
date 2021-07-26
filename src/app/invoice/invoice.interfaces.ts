import type { InvoiceEntity } from './invoice.entity';

export interface GetInvoiceOptions {
  globalSearch?: string;
}

export type ICreateInvoice = Omit<InvoiceEntity, 'createdAt' | 'updatedAt'>;
