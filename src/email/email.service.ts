import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RandomText } from '../utils/random';
import { User } from '../users/user.entity';
import { Email } from './email.entity';
import { CertifyDto } from './dto/certify.dto';

@Injectable()
export class EmailService {
  constructor(
    private readonly mailerService: MailerService,
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(Email) private emailsRepository: Repository<Email>,
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
        await this.emailsRepository.save({
          email: _email,
          certificationNumber: randomText,
          createdAt: new Date(),
        });

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

  async certify(data: CertifyDto): Promise<any> {
    if (!data.email || !data.certificationNumber) {
      return {
        result: false,
        message: '올바른 데이터가 전달되지 않았습니다.',
      };
    }

    const email = await this.emailsRepository.findOne({
      where: {
        email: data.email,
        certificationNumber: data.certificationNumber,
      },
    });

    if (email) {
      await this.emailsRepository.delete({ id: email.id });
      return {
        result: true,
        message: '인증되었습니다.',
      };
    } else {
      return {
        result: false,
        message: '인증번호가 맞지 않습니다.',
      };
    }
  }

  async findAll(): Promise<Email[]> {
    return this.emailsRepository.find();
  }
}
