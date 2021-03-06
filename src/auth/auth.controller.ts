import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Req,
} from '@nestjs/common';
import { RegisterDto } from './dtos/register.dto';
import { AuthService } from './auth.service';
import { User } from '../user/user.entity';
import { IUserAuth } from '../helpers/interfaces/user-detail.interface';
import { LoginDto } from './dtos/login.dto';
import { TokenResponse } from '../helpers/response-mapper/responses/token.response';
import { ConfigService } from '../config/config.service';
import { JsonWebTokenError } from 'jsonwebtoken';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Post('sign-up')
  async createAuth(@Body() registerDto: RegisterDto): Promise<User> {
    return await this.authService
      .registerUser(registerDto)
      .then((userAuth: IUserAuth) => userAuth.user);
  }

  @Post('sign-in')
  async signIn(@Body() loginDto: LoginDto): Promise<TokenResponse> {
    const token = await this.authService.signUser(loginDto);
    return {
      access_token: token,
      expires_in: this.configService.jwtExpiresTime,
      refresh_expires_in: this.configService.jwtRefreshTokenExpiresTime,
    };
  }

  @Post('invalidate')
  async invalidate(@Body('access_token') token: string, @Req() req) {
    try {
      return this.authService.invalidateToken(token, req.user);
    } catch (err) {
      if (err instanceof JsonWebTokenError) {
        throw new BadRequestException();
      }
      throw err;
    }
  }

  @Post('refresh')
  async refresh(@Body('access_token') token: string, @Req() req): Promise<TokenResponse> {
    try {
      const newToken = await this.authService.refreshToken(token, req.user);
      return {
        access_token: newToken,
        expires_in: this.configService.jwtExpiresTime,
        refresh_expires_in: this.configService.jwtRefreshTokenExpiresTime,
      };
    } catch (err) {
      if (err instanceof JsonWebTokenError) {
        throw new BadRequestException();
      }
      throw err;
    }
  }
}
