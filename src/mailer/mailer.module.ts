import { DynamicModule, Module, Provider } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { MailerOptions } from '../helpers/interfaces/mailer.options';

export interface TemplateEngine {
  compile(
    mail: any,
    callback: (err?: any, body?: string) => any,
    options: MailerOptions,
  ): void;
}

@Module({})
export class MailerModule {
  public static readonly MailerOptionKey = Symbol('mailerOptions');

  public static forRoot(options?: MailerOptions): DynamicModule {
    const MailerOptionsProvider: Provider = {
      provide: this.MailerOptionKey,
      useValue: options,
    };

    return {
      module: MailerModule,
      providers: [MailerOptionsProvider, MailerService],
      exports: [MailerService],
    };
  }
}
