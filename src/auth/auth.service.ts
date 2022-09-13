import {
  Injectable,
  HttpException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from './dto/createUser.dto';
import { User } from '../users/user.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ResultType } from '../interfaces/common';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async login(data: LoginDto) {
    const { email, password } = data;
    if (!email || !password) {
      throw new HttpException(
        {
          status: 500,
          error: '이메일 또는 패스워드가 입력되지 않았습니다.',
        },
        500,
      );
    }

    const user = await this.usersRepository.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      throw new UnauthorizedException('인증되지 않은 사용자입니다.');
    }

    const isUserPassword = await bcrypt.compare(password, user.password);

    if (!isUserPassword) {
      throw new UnauthorizedException('패스워드가 틀립니다.');
    }

    await this.usersRepository.update(user.id, {
      lastLoginedAt: new Date(),
    });
    const token = this.jwtService.sign({
      id: user.id,
      email: user.email,
      name: user.name,
    });

    return {
      status: true,
      token,
    };
  }

  async createUser(data: CreateUserDto): Promise<{
    result: boolean;
    message: string;
  }> {
    const { email, name, password, phone, position } = data;

    if (!email || !name || !password || !phone || !position) {
      throw new HttpException(
        {
          status: 500,
          error: '올바른 데이터가 전달되지 않았습니다.',
        },
        500,
      );
    }

    const user = await this.usersRepository.findOne({
      where: {
        email,
      },
    });

    if (user) {
      throw new HttpException(
        {
          status: 403,
          error: '이미 가입된 이메일 입니다.',
        },
        403,
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await this.usersRepository.save({
      email,
      name,
      password: hashedPassword,
      phone,
      position,
      createdAt: new Date(),
    });

    return {
      result: true,
      message: '회원가입이 완료 되었습니다.',
    };
  }

  async checkEmail(email: string): Promise<ResultType> {
    if (!email) {
      throw new BadRequestException('올바르지 않은 데이터를 전송하였습니다');
    }

    const user = await this.usersRepository.findOneBy({ email });

    if (user) {
      return {
        result: false,
        message: '이미 사용중인 이메일 입니다.',
      };
    }

    return {
      result: true,
      message: '사용 가능한 이메일 입니다.',
    };
  }
}
