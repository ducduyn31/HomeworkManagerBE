import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
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
import { RegisterDto } from './dtos/register.dto';
import { compareSync, hashSync } from 'bcrypt';
import { LoginDto } from './dtos/login.dto';
import { JwtPayload } from '../helpers/interfaces/jwt-payload.interface';

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

  async signUser(loginDto: LoginDto): Promise<any> {
    const auth: UserAuth = await this.authRepo.findOneOrFail({
      username: loginDto.username,
    });

    if (!compareSync(loginDto.password, auth.hashPassword)) {
      throw new UnauthorizedException();
    }

    const payload: JwtPayload = { id: auth.id, username: auth.username };

    return this.jwtService.sign(payload);
  }

  @Transaction()
  async registerUser(
    registerDto: RegisterDto,
    @TransactionManager() manager?: EntityManager,
  ): Promise<IUserAuth> {
    const user: User = await manager.save(
      UserService.initUser(registerDto),
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

  async validateUserOrFail(payload: JwtPayload): Promise<User> {
    const user: User = await this.userService.findById(payload.id);
    if (!user) { throw new UnauthorizedException(); }
    return user;
  }
}
