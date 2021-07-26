import { DefaultNamingStrategy, Table, NamingStrategyInterface } from 'typeorm';
import * as crypto from 'crypto';

export class CustomNamingStrategy extends DefaultNamingStrategy implements NamingStrategyInterface {
  // eslint-disable-next-line class-methods-use-this
  foreignKeyName(
    tableOrName: Table | string,
    columnNames: string[],
    referencedTablePath?: string,
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    referencedColumnNames?: string[],
  ): string {
    const tableOrNameEnhanced = typeof tableOrName === 'string' ? tableOrName : tableOrName.name;

    const names = columnNames.reduce(
      (name, column) => `${name}_${column}`,
      `${tableOrNameEnhanced}_${referencedTablePath}`,
    );

    // return `fk_${tableOrName}_${columnNames}`;
    return `fk_${crypto.createHash('md5').update(names).digest('hex')}`;
  }
}
