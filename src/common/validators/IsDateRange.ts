import { registerDecorator, ValidationOptions } from 'class-validator';
import { isMatch } from 'date-fns';

export function isDateRange(value: unknown): boolean {
  if (typeof value !== 'string') return false;

  const dates = value.split('_');
  if (dates.length !== 2) return false;

  const format = 'yyyy-MM-dd';
  const start = isMatch(dates[0], format);
  const end = isMatch(dates[1], format);

  return start === true && end === true;
}

export function IsDateRange(validationOptions?: ValidationOptions): PropertyDecorator {
  return (target, propertyName: string) => {
    registerDecorator({
      name: 'IsRangeDate',
      target: target.constructor,
      propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate: isDateRange,
        defaultMessage: () => {
          return `${propertyName} not valid date range format`;
        },
      },
    });
  };
}
