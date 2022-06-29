import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { MailerService } from '@nestjs-modules/mailer';
import { RandomText } from '../utils/random';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async verification(_email: string): Promise<{
    result: boolean;
    message: string;
    random?: string;
    err?: Error;
  }> {
    const randomText = RandomText();
    try {
      await this.mailerService.sendMail({
        to: _email,
        subject: '테스트',
        from: 'test@teamtodo.com',
        html: `테스트 ${randomText}`,
      });
      return {
        result: true,
        message: '회원가입 인증번호가 전송되었습니다.',
      };
    } catch (err) {
      return {
        result: false,
        message: 'error',
        err,
      };
    }
  }
}
