import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RandomText } from '../utils/random';
import { User } from '../users/user.entity';

@Injectable()
export class EmailService {
  constructor(
    private readonly mailerService: MailerService,
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async verification(_email: string): Promise<{
    result: boolean;
    message: string;
    err?: Error;
  }> {
    const user = await this.usersRepository.findOneBy({ email: _email });

    if (user) {
      return {
        result: false,
        message: '이미 가입된 계정 입니다.',
      };
    } else {
      const randomText = RandomText();
      try {
        await this.mailerService.sendMail({
          to: _email,
          subject: 'TeamTodo 회원가입 인증번호 입니다.',
          template: 'verification',
          context: { randomText: randomText },
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
}
