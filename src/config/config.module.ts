import { Module } from '@nestjs/common';
import { ConfigService } from './config.service';

@Module({
  providers: [
    {
      provide: ConfigService,
      useValue: new ConfigService(`${process.env.NODE_ENV || ''}.env`),
    },
  ],
  exports: [ConfigService],
})
export class ConfigModule {
  static getInstance(configPath: string = `${process.env.NODE_ENV || ''}.env`) {
    return new ConfigService(`${process.env.NODE_ENV || ''}.env`);
  }
}
