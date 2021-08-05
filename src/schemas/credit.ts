import { CreditEntity } from '@app/credit/credit.entity';

export type ICreateCredit = Pick<
  CreditEntity,
  'total' | 'description' | 'adminId' | 'storeId' | 'productId' | 'invoiceId' | 'transactionId'
>;
