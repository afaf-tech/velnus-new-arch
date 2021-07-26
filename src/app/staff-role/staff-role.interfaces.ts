import { EntityManager } from 'typeorm';
import { StaffRoleEntity } from './staff-role.entity';

export interface StaffRoleServiceGetOptions {
  storeId?: number;
  includes?: Array<string>;
}

export type StaffRoleColumnSearch = Pick<StaffRoleEntity, 'slug' | 'name' | 'storeId'>;

export interface StaffRoleServiceGetManyOptions {
  globalSearch?: string;
  // its from a query, and will return maybe string, boolean, number, but will return to string
  // cause its use by a `where` property
  columnSearch?: { [P in keyof StaffRoleColumnSearch]?: any };
  dateRange?: string[];
}

export interface StaffRoleServiceCreateOptions extends StaffRoleServiceGetOptions {
  entityManager?: EntityManager;
}

export type StaffRoleServiceUpdateOptions = StaffRoleServiceCreateOptions;

export type StaffRoleServiceDeleteOptions = StaffRoleServiceCreateOptions;

export type ICreateStaffRole = Pick<StaffRoleEntity, 'slug' | 'name' | 'storeId'> &
  Partial<Pick<StaffRoleEntity, 'id'> & { permissions: string[] }>;

export type IUpdateStaffRole = Partial<Omit<ICreateStaffRole, 'id'>>;
