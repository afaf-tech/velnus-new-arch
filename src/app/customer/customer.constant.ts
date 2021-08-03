import { CustomerColumnSearch } from '@schemas';

/**
 * Apa aja yang bisa dapat di cari, untuk aturan ada di interfaces
 */
export const customerColumnSearch: (keyof CustomerColumnSearch)[] = [
  'name',
  'address',
  'phoneNumber',
  'email',
  'storeId',
];
