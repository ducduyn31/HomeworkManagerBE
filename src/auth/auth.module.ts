import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAuth } from './auth.entity';
import { UserModule } from '../user/user.module';
import { ConfigModule } from '../config/config.module';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { BlacklistToken } from './blacklist-token.entity';

@Module({
  imports: [
    UserModule,
    ConfigModule,
    JwtModule.register({
      secret: ConfigModule.getInstance().jwtKey,
      signOptions: {
        expiresIn: ConfigModule.getInstance().jwtExpiresTime,
      },
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmModule.forFeature([UserAuth, BlacklistToken]),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {
}
