import { Body, Controller, Post } from '@nestjs/common';
import { RegisterDto } from './register.dto';
import { AuthService } from './auth.service';
import { User } from '../user/user.entity';
import { IUserAuth } from '../helpers/interfaces/user-detail.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  async createAuth(@Body() registerDto: RegisterDto): Promise<User> {
    return await this.authService
      .registerUser(registerDto)
      .then((userAuth: IUserAuth) => userAuth.user);
  }
}
