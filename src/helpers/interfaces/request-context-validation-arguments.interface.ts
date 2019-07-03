import { ValidationArguments } from 'class-validator';
import { User } from '../../user/user.entity';

export interface RequestContextValidationArguments extends ValidationArguments {
  object: {
    context: {
      user: User,
      requestUserId: number,
    },
  } & object;
}
