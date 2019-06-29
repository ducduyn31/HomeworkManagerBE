import { IsDateString, IsEmail, IsOptional, Length } from 'class-validator';
import { SqlUnique } from '../helpers/validators/sql-unique.validator';

export class CreateUserDto {
  @IsEmail()
  @SqlUnique({ table: 'user' })
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
