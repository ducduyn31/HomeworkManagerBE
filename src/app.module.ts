import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from './config/config.module';
import { MailerModule } from './mailer/mailer.module';

@Module({
  imports: [
    UserModule,
    AuthModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'secret',
      database: 'homework',
      timezone: '+7:00',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      logging: ['error'],
    }),
    ConfigModule,
    MailerModule,
  ],
})
export class AppModule {}
