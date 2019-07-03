import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { getManager } from 'typeorm';

@ValidatorConstraint({ async: true })
export class SqlUniqueConstraint implements ValidatorConstraintInterface {
  async validate(
    value: any,
    validationArguments?: ValidationArguments,
  ): Promise<boolean> {
    const tableName = validationArguments.constraints[0];
    const [_, count] = await getManager().findAndCount(tableName, {
      where: { [validationArguments.property]: value },
    });
    return count === 0;
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return '$property $value is duplicated.';
  }
}

export function SqlUnique(
  tableName: string,
  validationOptions?: ValidationOptions,
) {
  return (object, propertyName: string) => {
    registerDecorator({
      propertyName,
      target: object.constructor,
      options: validationOptions,
      constraints: [tableName],
      validator: SqlUniqueConstraint,
    });
  };
}
