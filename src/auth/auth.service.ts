import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { JwtPayload } from '../helpers/interfaces/jwt-payload.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserAuth } from './auth.entity';
import { User } from '../user/user.entity';
import { UserDetail } from '../helpers/interfaces/user-detail.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userServer: UserService,
    @InjectRepository(UserAuth)
    private readonly authRepo: Repository<UserAuth>,
  ) {}

  async findAuthAndUserByEmail(username: string): Promise<UserDetail> {
    const auth = await this.authRepo.findOneOrFail({ where: { username } });
    return {
      auth,
      user: null,
    };
  }

  async validateUser(payload: JwtPayload): Promise<any> {
    return null;
  }
}
