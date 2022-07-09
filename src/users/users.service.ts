import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

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

  async updateUser(user: User) {
    return `update User :${user}`;
    // this.usersRepository.save(user);
  }

  async deleteUser(user: User) {
    return `delete User :${user}`;
    // this.usersRepository.delete(user);
  }
}
