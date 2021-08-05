import { OrderColumnSearch } from '@schemas';

export enum OrderStatusEnum {
  Pending = 'pending',
  Process = 'process',
  Finish = 'finish',
  Cancelled = 'cancelled',
}

export const orderColumnSearch: (keyof OrderColumnSearch)[] = ['orderNum', 'status'];
