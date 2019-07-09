import { RequestContextValidationArguments } from '../interfaces/request-context-validation-arguments.interface';
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
} from 'class-validator';
import { SqlUniqueConstraint } from './sql-unique.validator';
import { NotFoundException } from '@nestjs/common';

@ValidatorConstraint({ async: true })
export class SqlUniqueExceptSelfValidator extends SqlUniqueConstraint {
  async validate(
    value: any,
    validationArguments?: RequestContextValidationArguments,
  ): Promise<boolean> {
    const currentUser = validationArguments.object.context.user;
    if (!currentUser) {
      throw new NotFoundException();
    }

    const property = validationArguments.property;

    if (
      currentUser.id === +validationArguments.object.context.requestUserId &&
      currentUser[property] &&
      currentUser[property] === value
    ) {
      return true;
    }

    return super.validate(value, validationArguments);
  }
}

export function SqlUniqueExceptSelf(
  tableName: string,
  validationOptions?: ValidationOptions,
) {
  return (object, propertyName: string) => {
    registerDecorator({
      propertyName,
      target: object.constructor,
      options: validationOptions,
      constraints: [tableName],
      validator: SqlUniqueExceptSelfValidator,
    });
  };
}
