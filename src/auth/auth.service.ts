import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
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
import { BlacklistToken } from './blacklist-token.entity';
import { ConfigService } from '../config/config.service';
import { ErrorMessage } from '../helpers/constants/strings';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    @InjectRepository(UserAuth)
    private readonly authRepo: Repository<UserAuth>,
    @InjectRepository(BlacklistToken)
    private readonly blacklistTokenRepo: Repository<BlacklistToken>,
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
    const user: User = await manager.save(UserService.initUser(registerDto));

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
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }

  async invalidateToken(
    token: string,
    issuedBy: User,
  ): Promise<BlacklistToken> {
    const payload: JwtPayload = this.jwtService.verify<JwtPayload>(token);

    const isBlacklisted = !!(await this.blacklistTokenRepo.findOne({ token }));
    if (isBlacklisted) {
      throw new BadRequestException(ErrorMessage.TOKEN_BLACKLISTED);
    }

    return this.blacklistTokenRepo.save(
      new BlacklistToken({
        token,
        createdAt: new Date(payload.iat * 1000),
        expiredAt: new Date(payload.exp * 1000),
        issuer: issuedBy,
        target: (payload.id as unknown) as User,
      }),
    );
  }

  async refreshToken(token: string, issuedBy: User): Promise<string> {
    const payload: JwtPayload = this.jwtService.verify(token);

    if (
      (payload.iat + this.configService.jwtRefreshTokenExpiresTime) * 1000 <
      Date.now()
    ) {
      throw new BadRequestException(ErrorMessage.REFRESH_TOKEN_EXPIRES);
    }

    await this.invalidateToken(token, issuedBy);

    return this.jwtService.sign({
      id: payload.id,
      username: payload.username,
    } as JwtPayload);
  }
}
