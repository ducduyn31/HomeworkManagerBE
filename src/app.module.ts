import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './user/user.controller';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [UserModule, AuthModule, TypeOrmModule.forRoot()],
  controllers: [AppController, UserController],
  providers: [AppService],
})
export class AppModule {
}
