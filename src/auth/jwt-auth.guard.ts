import { ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private whitelist: Array<{ handlerName: string; class: any }>;

  constructor(whitelist?: Array<{ handlerName: string; class: any }>) {
    super('jwt');
    this.whitelist = whitelist || [];
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    if (
      this.whitelist.some(
        whitelistedItem =>
          context.getHandler().name === whitelistedItem.handlerName &&
          context.getClass() === whitelistedItem.class,
      )
    ) {
      return true;
    }
    return super.canActivate(context);
  }
}
