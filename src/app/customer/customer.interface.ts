import { CustomerColumnSearch } from '@schemas';
import { CustomerEntity } from './customer.entity';

export interface CustomerServiceGetManyOptions {
  globalSearch?: string;
  // its from a query, and will return maybe string, boolean, number, but will return to string
  // cause its use by a `where` property
  columnSearch?: { [P in keyof CustomerColumnSearch]?: any };
  dateRange?: string[];
}

export type ICreateCustomer = Pick<
  CustomerEntity,
  'name' | 'phoneNumber' | 'address' | 'email' | 'password' | 'kabupaten' | 'provinsi' | 'storeId'
> &
  Partial<Pick<CustomerEntity, 'id'>>;

export type IUpdateCustomer = Partial<Omit<ICreateCustomer, 'id'>>;
