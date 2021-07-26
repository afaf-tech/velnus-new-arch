import { endOfDay, parseISO, startOfDay } from 'date-fns';
import { isEmpty } from 'lodash';
import { SelectQueryBuilder, Connection, EntityMetadata, Brackets, Repository } from 'typeorm';

export class SearchQuery<Entity = object> {
  connection: Connection;

  meta: EntityMetadata;

  constructor(repository: Repository<Entity>, private query: SelectQueryBuilder<Entity>) {
    this.meta = repository.metadata;
  }

  search<T = keyof Entity>(columns: T[], value?: any): void {
    if (isEmpty(value)) return;

    this.query.andWhere(
      new Brackets(qb => {
        columns.forEach((column, index) => {
          const columnStr = String(column);
          const parameters = { [columnStr]: `%${String(value)}%` };

          if (index === 0) {
            qb.where(`${this.meta.tableName}.${columnStr} LIKE :${columnStr}`, parameters);
          } else {
            qb.orWhere(`${this.meta.tableName}.${columnStr} LIKE :${columnStr}`, parameters);
          }
        });
      }),
    );
  }

  filter(columns?: { [P in keyof Entity]?: any }): void {
    if (!columns) return;

    const { ownColumns } = this.meta;
    this.query.andWhere(
      new Brackets(qb => {
        Object.entries(columns).forEach(([key, value]) => {
          const have = ownColumns.some(column => column.propertyName === key);
          if (have) {
            qb.andWhere(`${this.meta.tableName}.${key} = :${key}`, { [key]: String(value) });
          }
        });
      }),
    );
  }

  dateRange(columnName: string, range?: string[]) {
    if (range && range.length) {
      const startDate = startOfDay(parseISO(range[0]));
      const endDate = endOfDay(parseISO(range[1]));

      this.query.andWhere(`${this.meta.tableName}.${columnName} BETWEEN :startDate AND :endDate`, {
        startDate,
        endDate,
      });
    }
  }
}
