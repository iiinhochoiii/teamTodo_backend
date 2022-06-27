import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { RandomText } from '../utils/random';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private readonly mailerService: MailerService,
  ) {}

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async createUser(user: User) {
    this.usersRepository.save(user);
  }

  async getUser(_id: number) {
    return `get User :${_id}`;
    // return this.usersRepository.find({
    //   select: ['id', 'email', 'name', 'phone', 'profile'],
    //   where: [{ id: _id }],
    // });
  }

  async updateUser(user: User) {
    return `update User :${user}`;
    // this.usersRepository.save(user);
  }

  async deleteUser(user: User) {
    return `delete User :${user}`;
    // this.usersRepository.delete(user);
  }

  async verification(_email: string): Promise<{
    result: boolean;
    message: string;
    random?: string;
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
}
