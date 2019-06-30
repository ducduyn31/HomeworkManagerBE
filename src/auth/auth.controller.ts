import { Body, Controller, Post } from '@nestjs/common';
import { RegisterDto } from './dtos/register.dto';
import { AuthService } from './auth.service';
import { User } from '../user/user.entity';
import { IUserAuth } from '../helpers/interfaces/user-detail.interface';
import { LoginDto } from './dtos/login.dto';

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
  async signIn(@Body() loginDto: LoginDto) {
    const token =  await this.authService.validateUser(loginDto);
    return {
      access_token: token,
      expires_in: 3600,
    };
  }
}
