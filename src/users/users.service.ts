import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async createUser(user: User) {
    this.usersRepository.save(user);
  }

  async getUser(_id: number) {
    return this.usersRepository.find({
      select: ['id', 'email', 'name', 'phone', 'profile'],
      where: [{ id: _id }],
    });
  }

  async updateUser(user: User) {
    this.usersRepository.save(user);
  }

  async deleteUser(user: User) {
    this.usersRepository.delete(user);
  }
}
