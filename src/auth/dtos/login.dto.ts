import { IsString, Length } from 'class-validator';
import { ExistsIn } from '../../helpers/validators/sql-exists.validator';
import { TableName as authTbName } from '../auth.entity';

export class LoginDto {
  @IsString()
  @Length(8, 20)
  @ExistsIn({ table: authTbName })
  readonly username: string;

  @IsString()
  @Length(8)
  readonly password: string;
}
