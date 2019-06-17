import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secretOrPrivateKey: '',
      signOptions: {
        expiresIn: 3600,
      },
    }),
  ],
  providers: [AuthService],
})
export class AuthModule {}
