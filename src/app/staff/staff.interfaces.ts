import { EntityManager } from 'typeorm';
import type { StaffEntity } from './staff.entity';

export interface StaffServiceGetOptions {
  storeId?: number;
}

/**
 * Where colum allowing to search
 */
export type StaffColumnSearch = Pick<
  StaffEntity,
  'username' | 'name' | 'address' | 'position' | 'roleId' | 'storeId'
>;

export interface StaffServiceGetManyOptions {
  globalSearch?: string;
  // its from a query, and will return maybe string, boolean, number, but will return to string
  // cause its use by a `where` property
  columnSearch?: { [P in keyof StaffColumnSearch]?: any };
  dateRange?: string[];
}

export interface StaffServiceCreateOptions extends StaffServiceGetOptions {
  entityManager?: EntityManager;
}

export type StaffServiceUpdateOptions = StaffServiceCreateOptions;

export type StaffServiceDeleteOptions = StaffServiceCreateOptions;

export type ICreateStaff = Pick<
  StaffEntity,
  'username' | 'password' | 'name' | 'address' | 'storeId' | 'roleId'
> &
  Partial<Pick<StaffEntity, 'id' | 'position' | 'createdById'>>;

export type IUpdateStaff = Partial<Omit<ICreateStaff, 'id'>>;
