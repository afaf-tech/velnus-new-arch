import { EntityManager } from 'typeorm';
import { StoreEntity } from './store.entity';

export type StoreColumnSearch = Pick<StoreEntity, 'name' | 'address'>;

export interface StoreServiceGetManyOptions {
  globalSearch?: string;
  columnSearch?: { [P in keyof StoreColumnSearch]?: any };
  dateRange?: string[];
}

export interface StoreServiceCreateOptions {
  entityManager?: EntityManager;
}

export type StoreServiceUpdateOptions = StoreServiceCreateOptions;

export type StoreServiceDeleteOptions = StoreServiceCreateOptions;

export type ICreateStore = Pick<StoreEntity, 'name' | 'address'> & Partial<Pick<StoreEntity, 'id'>>;

export type IUpdateStore = Partial<Omit<ICreateStore, 'id'>>;
