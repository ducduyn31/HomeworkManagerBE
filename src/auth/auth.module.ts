import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAuth } from './auth.entity';
import { UserModule } from '../user/user.module';
import { UserService } from '../user/user.service';
import { ConfigModule } from '../config/config.module';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    UserModule,
    ConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: ConfigModule.getInstance().jwtKey,
      signOptions: {
        expiresIn: 3600,
      },
    }),
    TypeOrmModule.forFeature([UserAuth]),
  ],
  providers: [AuthService, UserService],
  controllers: [AuthController],
})
export class AuthModule {
}
