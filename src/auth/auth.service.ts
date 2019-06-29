import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { JwtPayload } from '../helpers/interfaces/jwt-payload.interface';
import { InjectRepository } from '@nestjs/typeorm';
import {
  EntityManager,
  Repository,
  Transaction,
  TransactionManager,
} from 'typeorm';
import { UserAuth } from './auth.entity';
import { User } from '../user/user.entity';
import { IUserAuth } from '../helpers/interfaces/user-detail.interface';
import { RegisterDto } from './register.dto';
import { hashSync } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    @InjectRepository(UserAuth)
    private readonly authRepo: Repository<UserAuth>,
  ) {}

  async findAuthAndUserByEmail(username: string): Promise<IUserAuth> {
    const auth = await this.authRepo.findOneOrFail({ where: { username } });
    return {
      auth,
      user: null,
    };
  }

  async validateUser(payload: JwtPayload): Promise<any> {
    return null;
  }

  @Transaction()
  async registerUser(
    registerDto: RegisterDto,
    @TransactionManager() manager?: EntityManager,
  ): Promise<IUserAuth> {
    const user: User = await manager.save(
      this.userService.initUser(registerDto),
    );

    const toSaveUserAuth: UserAuth = new UserAuth({
      username: registerDto.username,
    });
    toSaveUserAuth.hashPassword = hashSync(registerDto.password, 10);
    toSaveUserAuth.user = user;

    const userAuth: UserAuth = await manager.save(toSaveUserAuth);
    return {
      user,
      auth: userAuth,
    };
  }
}
