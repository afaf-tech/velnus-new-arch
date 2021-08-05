import { InvoiceColumnSearch } from 'src/schemas/invoice';

export enum InvoiceStatusEnum {
  Unpaid = 'UNPAID',
  Paid = 'PAID',
}

export const invoiceColumnSearch: (keyof InvoiceColumnSearch)[] = ['customerId', 'status'];
