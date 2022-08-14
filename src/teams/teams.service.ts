import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Team } from './team.entity';
import { Repository } from 'typeorm';
import { ResultType } from '../interfaces/common';
import { CreateTeamDto } from './dto/createTeam.dto';
import { User } from '../users/user.entity';
import { TeamMember } from '../teamMembers/teamMember.entity';

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(Team) private teamsRepository: Repository<Team>,
    @InjectRepository(TeamMember)
    private teamMemberRepository: Repository<TeamMember>,
  ) {}

  async create(id: number, body: CreateTeamDto): Promise<ResultType> {
    const { name, description, maskcot } = body;
    const user = await this.usersRepository.findOneBy({ id });

    if (!name) {
      throw new BadRequestException('올바르지 않은 데이터를 전송하였습니다.');
    }

    if (!user) {
      throw new NotFoundException(
        '서버로 부터 생성자 정보를 찾을 수 없습니다.',
      );
    }

    const team = await this.teamsRepository.findOneBy({ name });

    if (team) {
      throw new BadRequestException('이미 등록된 팀 이름 입니다.');
    }

    const result = await this.teamsRepository.save({
      name: name,
      creatorUserId: id,
      description: description,
      maskcot: maskcot,
      createdAt: new Date(),
    });

    const teamMember = await this.teamMemberRepository.save({
      team_id: result.id,
      user_id: id,
      role: 'owner',
      isActive: true,
    });

    return {
      result: true,
      message: '팀이 생성되었습니다.',
      data: {
        ...result,
        teamMember: teamMember,
      },
    };
  }

  async find(id: number): Promise<ResultType> {
    const res = await this.teamMemberRepository.find({
      where: {
        user_id: id,
      },
      relations: ['team'],
    });

    return {
      result: true,
      data: res,
    };
  }

  async deleteTeam(id: number): Promise<ResultType | any> {
    if (!id) {
      throw new BadRequestException('올바르지 않은 데이터를 전송하였습니다.');
    }

    const team = await this.teamsRepository.findOneBy({ id });

    if (!team) {
      throw new NotFoundException('서버로 부터 팀 정보를 찾을 수 없습니다.');
    }

    const teamMember = await this.teamMemberRepository.find({
      where: {
        team_id: team.id,
      },
    });

    if (teamMember.filter((member) => member.role !== 'owner').length > 0) {
      return {
        result: false,
        message: '팀에 소속된 멤버들이 존재 합니다.',
      };
    }

    await this.teamMemberRepository.delete({ id: teamMember[0].id });
    await this.teamsRepository.delete({ id: team.id });

    return {
      result: true,
      message: '팀이 삭제되었습니다.',
    };
  }

  async checkTeamName(name: string): Promise<ResultType> {
    if (!name) {
      throw new BadRequestException('올바르지 않은 데이터를 전송하였습니다');
    }

    const team = await this.teamsRepository.findOneBy({ name });

    if (team) {
      return {
        result: false,
        message: '이미 사용중인 팀 이름 입니다.',
      };
    }

    return {
      result: true,
      message: '사용 가능한 팀 이름 입니다.',
    };
  }

  async findAll() {
    return this.teamsRepository
      .createQueryBuilder('team')
      .innerJoinAndMapMany(
        'team.members',
        TeamMember,
        'teamMember',
        'team.id = teamMember.team_id',
      )
      .where('teamMember.user_id = :user_id', { user_id: 4 })
      .getMany();
  }
}
