import { ExecutionContext, Injectable } from '@nestjs/common';
import { isObservable } from 'rxjs';
import { AuthGuard } from '@nestjs/passport';
import { ExtractJwt } from 'passport-jwt';
import { BlacklistToken } from './blacklist-token.entity';
import { getConnection, Repository } from 'typeorm';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private whitelist: Array<{ handlerName: string; class: any }>;
  private readonly blacklistTokenRepo: Repository<BlacklistToken>;

  constructor(
    whitelist: Array<{ handlerName: string; class: any }>,
  ) {
    super('jwt');
    this.whitelist = whitelist || [];
    this.blacklistTokenRepo = getConnection().getRepository(BlacklistToken);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (
      this.whitelist.some(
        whitelistedItem =>
          context.getHandler().name === whitelistedItem.handlerName &&
          context.getClass() === whitelistedItem.class,
      )
    ) {
      return true;
    }

    const token: string = ExtractJwt.fromAuthHeaderAsBearerToken()(
      context.switchToHttp().getRequest(),
    );

    const blacklistToken = await (await this.blacklistTokenRepo).findOne({ token });

    if (!blacklistToken) {
      const can = super.canActivate(context);
      if (isObservable(can)) {
        return can.toPromise();
      }

      return can;
    }

    return false;
  }
}
