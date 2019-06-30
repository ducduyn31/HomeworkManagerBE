import { CreateUserDto } from '../../user/create-user.dto';
import { SqlUnique } from '../../helpers/validators/sql-unique.validator';
import { TableName as authTableName } from '../auth.entity';
import { IsString, Length } from 'class-validator';

export class RegisterDto extends CreateUserDto {

  @SqlUnique({ table: authTableName })
  @Length(8, 20)
  readonly username: string;

  @Length(8)
  @IsString()
  readonly password: string;
}
