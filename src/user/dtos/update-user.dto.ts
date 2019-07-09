import { IsEmail } from 'class-validator';
import { TableName as UserTableName } from '../user.entity';
import { SqlUniqueExceptSelf } from '../../helpers/validators/sql-unique-except-self.validator';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends CreateUserDto {
  @IsEmail()
  @SqlUniqueExceptSelf(UserTableName)
  readonly email: string;
}
