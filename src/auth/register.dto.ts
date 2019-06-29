import { CreateUserDto } from '../user/create-user.dto';
import { SqlUnique } from '../helpers/validators/sql-unique.validator';
import { DBName as authDBName } from './auth.entity';
import { IsString, Length } from 'class-validator';

export class RegisterDto extends CreateUserDto {

  @SqlUnique({ table: authDBName })
  @Length(8, 20)
  readonly username: string;

  @Length(8)
  @IsString()
  readonly password: string;
}
