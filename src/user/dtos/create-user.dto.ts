import { IsDateString, IsEmail, IsOptional, Length } from 'class-validator';
import { SqlUnique } from '../../helpers/validators/sql-unique.validator';
import { TableName as UserTableName } from '../user.entity';

export class CreateUserDto {
  @IsEmail()
  @SqlUnique(UserTableName)
  readonly email: string;

  @Length(5, 20)
  readonly displayName: string;

  @IsDateString()
  @IsOptional()
  readonly dob?: Date;

  @IsOptional()
  @Length(9, 11)
  readonly phone?: string;

  @IsOptional()
  readonly gender: string;

  @IsOptional()
  avatar: string;
}
