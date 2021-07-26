import { iterate } from 'iterare';
import { ValidationError } from 'class-validator';

export class BaseValidationError {
  validationErrors: ValidationError[] = [];

  message: string;

  validations: Record<string, string[]>;

  constructor(validationErrors: ValidationError[], message = 'Error validation') {
    this.message = message;
    this.validationErrors = validationErrors;

    this.setValidationMessage();
  }

  protected setValidationMessage(validationErrors?: ValidationError[]): Record<string, string[]> {
    if (!validationErrors) validationErrors = this.validationErrors;

    const messages = iterate(validationErrors)
      .map(error => this.mapChildrenToValidationErrors(error))
      .flatten()
      .reduce((accumulator: { [k: string]: string[] }, value) => {
        const { property, constraints } = value;
        if (!(property in accumulator) && constraints) {
          accumulator[property] = Object.values(constraints);
        }

        return accumulator;
      }, {});

    this.validations = messages;

    return messages;
  }

  protected mapChildrenToValidationErrors(
    error: ValidationError,
    parentPath?: string,
  ): ValidationError[] {
    if (!(error.children && error.children.length)) {
      return [error];
    }
    const validationErrors: ValidationError[] = [];

    parentPath = parentPath ? `${parentPath}.${error.property}` : error.property;

    // eslint-disable-next-line no-restricted-syntax
    for (const item of error.children) {
      // when have children, push to list before delete
      if (item.children && item.children.length) {
        validationErrors.push(...this.mapChildrenToValidationErrors(item, parentPath));
        // delete children, cause its confusing me at development :P
        delete item.children;
      }

      item.property = `${parentPath}.${item.property}`;
      validationErrors.push(item);
    }

    return validationErrors;
  }
}
