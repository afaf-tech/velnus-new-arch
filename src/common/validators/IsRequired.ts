import { IsDefined, ValidationOptions } from 'class-validator';

export const IsRequired: Function = (validationOptions?: ValidationOptions) => {
  return IsDefined({ message: ({ property }) => `${property} is required`, ...validationOptions });
};
