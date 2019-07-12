import { Inject, Injectable } from '@nestjs/common';
import {
  createTransport,
  SendMailOptions,
  SentMessageInfo,
  Transporter,
} from 'nodemailer';
import { MailerOptions } from '../helpers/interfaces/mailer.options';
import { MailerModule, TemplateEngine } from './mailer.module';

@Injectable()
export class MailerService {
  private transporter: Transporter;

  constructor(
    @Inject(MailerModule.MailerOptionKey)
    private readonly mailerOptions: MailerOptions,
  ) {
    if (
      !mailerOptions.transport ||
      Object.keys(mailerOptions.transport).length === 0
    ) {
      throw new Error(
        'Make sure to provide a nodemailer transport configuration object, ' +
          'connection url or a transport plugin instance.',
      );
    }

    this.transporter = createTransport(
      this.mailerOptions.transport,
      this.mailerOptions.defaults,
    );

    const templateEngine: TemplateEngine =
      mailerOptions.template && mailerOptions.template.engine;

    if (templateEngine) {
      this.transporter.use('compile', (mail, callback) => {
        if (mail.data.html) {
          return callback();
        }

        return templateEngine.compile(mail, callback, this.mailerOptions);
      });
    }
  }

  async sendMail(data: SendMailOptions): Promise<SentMessageInfo> {
    return await this.transporter.sendMail(data);
  }
}
