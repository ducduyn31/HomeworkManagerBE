import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { CreateUserDto } from './create-user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {

  constructor(private readonly userService: UserService) {}

  @Post()
  @HttpCode(204)
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.userService.createNew(createUserDto);
  }
}
