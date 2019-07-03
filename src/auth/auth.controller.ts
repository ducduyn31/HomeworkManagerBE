import { Body, Controller, Post } from '@nestjs/common';
import { RegisterDto } from './dtos/register.dto';
import { AuthService } from './auth.service';
import { User } from '../user/user.entity';
import { IUserAuth } from '../helpers/interfaces/user-detail.interface';
import { LoginDto } from './dtos/login.dto';
import { TokenResponse } from '../helpers/response-mapper/responses/token.response';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  async createAuth(@Body() registerDto: RegisterDto): Promise<User> {
    return await this.authService
      .registerUser(registerDto)
      .then((userAuth: IUserAuth) => userAuth.user);
  }

  @Post('sign-in')
  async signIn(@Body() loginDto: LoginDto): Promise<TokenResponse> {
    const token =  await this.authService.signUser(loginDto);
    return {
      access_token: token,
      refresh_token: null,
      expires_in: 3600,
    };
  }
}
