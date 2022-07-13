import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UpdateUserDto } from './dto/updateUser.dto';
import { ResultType } from '../interfaces/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async getUser(_id: number) {
    return `get User :${_id}`;
    // return this.usersRepository.find({
    //   select: ['id', 'email', 'name', 'phone', 'profile'],
    //   where: [{ id: _id }],
    // });
  }

  async updateUser(id: number, body: UpdateUserDto): Promise<ResultType | any> {
    const user = await this.usersRepository.findOneBy({ id });

    if (!body.name && !body.password && !body.phone) {
      throw new BadRequestException('올바르지 않은 데이터를 전송하였습니다.');
    }

    if (!user) {
      throw new NotFoundException(
        '서버로 부터 변경하는 데이터를 찾을 수 없습니다.',
      );
    }

    let hashedPassword = undefined;

    if (body.password) {
      hashedPassword = await bcrypt.hash(body?.password, 10);
    }

    await this.usersRepository.update(user.id, {
      password: hashedPassword,
      name: body.name,
      phone: body.phone,
      updatedAt: new Date(),
    });

    return {
      result: true,
      message: '유저 정보가 변경되었습니다.',
    };
  }

  async deleteUser(user: User) {
    return `delete User :${user}`;
    // this.usersRepository.delete(user);
  }
}
