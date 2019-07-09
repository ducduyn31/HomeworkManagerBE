import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { SqlAddress } from '../interfaces/sql-address.interface';
import { getManager } from 'typeorm';

@ValidatorConstraint({ async: true })
export class SqlExistConstraint implements ValidatorConstraintInterface {
  async validate(
    value: any,
    validationArguments?: ValidationArguments,
  ): Promise<boolean> {
    const tableName = (validationArguments.constraints[0] as SqlAddress).table;
    const [_, count] = await getManager().findAndCount(tableName, {
      where: { [validationArguments.property]: value },
    });
    return count >= 1;
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return '$property $value does not exist.';
  }
}

export function ExistsIn(
  location: SqlAddress,
  validationOptions?: ValidationOptions,
) {
  return (object, propertyName: string) => {
    registerDecorator({
      propertyName,
      target: object.constructor,
      options: validationOptions,
      constraints: [location],
      validator: SqlExistConstraint,
    });
  };
}
