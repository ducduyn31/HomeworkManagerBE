import { Module } from '@nestjs/common';
import { ConfigService } from './config.service';

let instance = null;

@Module({
  providers: [
    {
      provide: ConfigService,
      useValue: ConfigModule.getInstance(),
    },
  ],
  exports: [ConfigService],
})
export class ConfigModule {
  static getInstance(configPath: string = `${process.env.NODE_ENV || ''}.env`) {
    if (!instance) { instance = new ConfigService(configPath); }
    return instance;
  }
}
