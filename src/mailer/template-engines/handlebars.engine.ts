import { TemplateEngine } from '../mailer.module';
import { MailerOptions } from '../../helpers/interfaces/mailer.options';
import { get } from 'lodash';
import { TemplateDelegate } from 'handlebars';
import * as path from 'path';
import * as fs from 'fs';
import compile = Handlebars.compile;

export class HandlebarsEngine implements TemplateEngine {
  private precompiledTemplates: { [name: string]: TemplateDelegate } = {};

  compile(
    mail: any,
    callback: (err?: any, body?: string) => any,
    options: MailerOptions,
  ): void {
    const templateExt = path.extname(mail.data.template) || '.hbs';
    const templateName = path.basename(
      mail.data.template,
      path.extname(mail.data.template),
    );
    const templateDir =
      path.dirname(mail.data.template) !== '.'
        ? path.dirname(mail.data.template)
        : get(options, 'template.dir', '');
    const templatePath = path.join(templateDir, templateName + templateExt);

    if (!this.precompiledTemplates[templateName]) {
      try {
        const template = fs.readFileSync(templatePath, 'UTF-8');

        this.precompiledTemplates[templateName] = compile(
          template,
          get(options, 'template.options', {}),
        );
      } catch (err) {
        return callback(err);
      }

      mail.data.html = this.precompiledTemplates[templateName](
        mail.data.context,
      );

      return callback();
    }
  }
}
