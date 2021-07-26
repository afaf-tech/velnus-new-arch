import { EntityManager } from 'typeorm';
import { AdminEntity } from './admin.entity';

export type AdminColumnSearch = Pick<AdminEntity, 'username'>;

export interface AdminServiceGetManyOptions {
  globalSearch?: string;
  columnSearch?: { [P in keyof AdminColumnSearch]?: any };
  dateRange?: string[];
}

export interface AdminServiceCreateOptions {
  entityManager?: EntityManager;
}

export type AdminServiceUpdateOptions = AdminServiceCreateOptions;

export type AdminServiceDeleteOptions = AdminServiceCreateOptions;

export type ICreateAdmin = Pick<AdminEntity, 'username' | 'password'> &
  Partial<Pick<AdminEntity, 'id'>>;

export type IUpdateAdmin = Partial<Omit<ICreateAdmin, 'id'>>;
