import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class RequestContextInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    if (
      request.header &&
      request.user &&
      request.body &&
      request.params &&
      request.params.id
    ) {
      request.body.context = {
        user: request.user,
        requestUserId: request.params.id,
      };
    }

    return next.handle();
  }
}
