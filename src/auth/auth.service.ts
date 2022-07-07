import {
  Injectable,
  HttpException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoginDto } from './dto/login.dto';
import { User } from '../users/user.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

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
}
