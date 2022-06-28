import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        service: 'gmail',
        port: 587,
        host: process.env.EMAIL_HOST,
        secure: true,
        auth: {
          user: process.env.EMAIL_AUTH_USER,
          pass: process.env.EMAIL_AUTH_PASS,
        },
        preview: true,
        template: {
          dir: __dirname + '/templates',
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      },
    }),
  ],
  providers: [EmailService],
  controllers: [EmailController],
})
export class EmailModule {}
