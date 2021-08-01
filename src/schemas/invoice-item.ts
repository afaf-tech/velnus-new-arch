import { InvoiceItemEntity } from '@app/invoice/invoice-item.entity';

export type CreateInvoiceItem = Pick<
  InvoiceItemEntity,
  'amountEach' | 'customerId' | 'description' | 'dueDate' | 'notes' | 'relId' | 'total' | 'quantity'
>;
