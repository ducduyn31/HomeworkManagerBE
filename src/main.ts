import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { AuthWhitelist } from './helpers/constants/auth-whitelist';
import { StripRequestContextPipe } from './helpers/pipes/strip-request-context.pipe';
import { RequestContextInterceptor } from './helpers/interceptors/request-context.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalGuards(new JwtAuthGuard(AuthWhitelist));
  app.useGlobalInterceptors(new RequestContextInterceptor());
  app.useGlobalPipes(new ValidationPipe(), new StripRequestContextPipe());
  await app.listen(3000);
}

bootstrap();
