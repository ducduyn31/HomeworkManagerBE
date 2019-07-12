import * as SMTPTransport from 'nodemailer/lib/smtp-transport';
import { TemplateEngine } from '../../mailer/mailer.module';

export interface MailerOptions {
  defaults?: SMTPTransport.Options;
  transport?: SMTPTransport | SMTPTransport.Options | string;
  template: {
    dir?: string;
    engine?: TemplateEngine;
    options?: {
      [name: string]: any;
    };
  };
}
