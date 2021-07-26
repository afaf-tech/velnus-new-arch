import { StoreColumnSearch } from './store.interface';

/**
 * Apa aja yang bisa dapat di cari, untuk aturan ada di interfaces
 */
export const storeColumnSearch: (keyof StoreColumnSearch)[] = ['name', 'address'];
