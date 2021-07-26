/**
 * @see https://github.com/typeorm/typeorm/issues/873
 */

import { ValueTransformer } from 'typeorm';

function isNullOrUndefined<T>(obj: T | null | undefined): obj is null | undefined {
  return typeof obj === 'undefined' || obj === null;
}

export const ColumnNumericTransformer: ValueTransformer = {
  to(data: number | null): number | null {
    if (!isNullOrUndefined(data)) {
      return data;
    }

    return null;
  },
  from(data: string): number {
    if (!isNullOrUndefined(data)) {
      const num = Number(data);
      if (!Number.isNaN(num)) return num;
    }

    return null;
  },
};
