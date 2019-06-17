import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({}),
  ],
  providers: [UserService],
})
export class UserModule {
}
