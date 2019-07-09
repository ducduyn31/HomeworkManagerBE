import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PassportModule } from '@nestjs/passport';
import { SoftDeleteRepository } from '../helpers/traits/soft-delete';

@Module({
  imports: [
    TypeOrmModule.forFeature([SoftDeleteRepository]),
    PassportModule,
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {
}
