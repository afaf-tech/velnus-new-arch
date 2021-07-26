import { StaffColumnSearch } from './staff.interfaces';

export enum StaffPosition {
  ADMINSTAFF = 'staffadmin',
  GENERALSTAFF = 'generalstaff',
  ADMINISTRATOR = 'administrator',
  OTHER = 'other',
}

/**
 * Apa aja yang bisa dapat di cari, untuk aturan ada di interfaces
 */
export const staffColumnSearch: (keyof StaffColumnSearch)[] = [
  'username',
  'name',
  'address',
  'position',
  'roleId',
  'storeId',
];
