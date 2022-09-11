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
import { TeamMember } from '../teamMembers/teamMember.entity';
import { Team } from '../teams/team.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async findMy(id: number): Promise<User | any> {
    const user = await this.usersRepository
      .createQueryBuilder('user')
      .leftJoinAndMapMany(
        'team.members',
        TeamMember,
        'members',
        'members.user_id = user.id',
      )
      .leftJoinAndMapMany(
        'user.team',
        Team,
        'team',
        'team.id = members.team_id',
      )
      .select([
        'user.id',
        'user.email',
        'user.name',
        'user.phone',
        'user.profile',
        'user.createdAt',
        'user.updatedAt',
        'user.lastLoginedAt',
        'members',
        'team',
      ])
      .where('user.id = :id', { id })
      .getOne();

    if (!user) {
      throw new NotFoundException('서버로 부터 유저 정보를 찾을 수 없습니다.');
    }

    return user;
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async getUser(id: number): Promise<User> {
    if (!id) {
      throw new BadRequestException('올바르지 않은 데이터를 요청하였습니다.');
    }

    const user = await this.usersRepository.findOne({
      select: [
        'id',
        'email',
        'name',
        'phone',
        'profile',
        'createdAt',
        'updatedAt',
        'lastLoginedAt',
      ],
      where: [{ id }],
    });

    if (!user) {
      throw new NotFoundException('서버로 부터 유저 정보를 찾을 수 없습니다.');
    }

    return user;
  }

  async updateUser(id: number, body: UpdateUserDto): Promise<ResultType> {
    const user = await this.usersRepository.findOneBy({ id });

    if (!body.name && !body.password && !body.phone && !body.profile) {
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
      profile: body.profile,
      updatedAt: new Date(),
    });

    return {
      result: true,
      message: '유저 정보가 변경되었습니다.',
    };
  }

  async deleteUser(id: number): Promise<ResultType> {
    if (!id) {
      throw new BadRequestException('올바르지 않은 데이터를 요청하였습니다.');
    }

    const user = await this.usersRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException('서버로 부터 유저 정보를 찾을 수 없습니다.');
    }

    await this.usersRepository.delete({ id: user.id });

    return {
      result: true,
      message: '유저가 삭제되었습니다.',
    };
  }
}
