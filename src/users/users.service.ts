import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/createUser.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async createUser(data: CreateUserDto): Promise<{
    result: boolean;
    message: string;
  }> {
    const { email, name, password, phone } = data;

    if (!email || !name || !password || !phone) {
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
      createdAt: new Date(),
    });

    return {
      result: true,
      message: '회원가입이 완료 되었습니다.',
    };
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
}
