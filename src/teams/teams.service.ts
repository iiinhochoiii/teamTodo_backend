import {
  Injectable,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Team } from './team.entity';
import { In, Repository } from 'typeorm';
import { ResultType } from '../interfaces/common';
import { CreateTeamDto } from './dto/createTeam.dto';
import { UpdateTeamDto } from './dto/updateTeam.dto';
import { InviteTeamDto } from './dto/inviteTeam.dto';
import { DistoryMember } from './dto/distroyMemeber.dto';

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

  async update(
    user_id: number,
    body: UpdateTeamDto,
  ): Promise<ResultType | any> {
    const { id, name, maskcot, description } = body;
    if (!id) {
      throw new BadRequestException('올바르지 않은 데이터를 전송하였습니다.');
    }

    const team = await this.teamsRepository.findOneBy({ id });

    if (!team) {
      throw new NotFoundException(
        '서버로 부터 변경할 정보를 찾을 수 없습니다.',
      );
    }

    if (user_id !== team.creatorUserId) {
      throw new UnauthorizedException('팀 정보를 변경할 수 없는 권한입니다.');
    }

    if (name) {
      const checkTeam = await this.teamsRepository.findOneBy({ name });

      if (checkTeam) {
        throw new BadRequestException('이미 등록된 팀 이름 입니다.');
      }
    }

    await this.teamsRepository.update(id, {
      name,
      maskcot,
      description,
      updatedAt: new Date(),
    });

    return {
      result: true,
      message: '팀 정보가 변경되었습니다.',
      data: {
        ...team,
        ...body,
      },
    };
  }

  async find(id: number): Promise<ResultType> {
    const team = await this.teamsRepository
      .createQueryBuilder('team')
      .leftJoinAndMapMany(
        'team.members',
        TeamMember,
        'members',
        'members.team_id = team.id',
      )
      .leftJoinAndMapOne(
        'members.user',
        User,
        'user',
        'user.id = members.user_id',
      )
      .select([
        'team',
        'members',
        'user.id',
        'user.name',
        'user.email',
        'user.lastLoginedAt',
        'user.phone',
        'user.profile',
        'user.position',
      ])
      .getMany();

    const myTeams = team.filter((item: any) =>
      item.members.find((member) => member.user_id === id),
    );

    if (!myTeams) {
      throw new NotFoundException('서버로 부터 팀 정보를 찾을 수 없습니다.');
    }

    return {
      data: myTeams,
    };
  }

  async findByTeamName(id: number, name: string): Promise<ResultType> {
    if (!id || !name) {
      throw new BadRequestException('올바르지 않은 데이터를 전송하였습니다.');
    }

    const team = await this.teamsRepository
      .createQueryBuilder('team')
      .leftJoinAndMapMany(
        'team.members',
        TeamMember,
        'members',
        'members.team_id = team.id',
      )
      .leftJoinAndMapOne(
        'members.user',
        User,
        'user',
        'user.id = members.user_id',
      )
      .where('team.name = :name', { name })
      .select([
        'team',
        'members',
        'user.id',
        'user.name',
        'user.email',
        'user.lastLoginedAt',
        'user.phone',
        'user.profile',
        'user.position',
      ])
      .getOne();

    if (!team) {
      throw new NotFoundException('서버로 부터 팀 정보를 찾을 수 없습니다.');
    }

    return {
      data: team,
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

    await this.teamMemberRepository.delete({
      id: teamMember[0].id,
    });
    await this.teamsRepository.delete({ id: team.id });

    return {
      result: true,
      message: '팀이 삭제되었습니다.',
      data: {
        team_id: id,
      },
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

  async invite(body: InviteTeamDto): Promise<ResultType> {
    const { teamId, emails } = body;

    const team = await this.teamsRepository.findOne({
      where: {
        id: teamId,
      },
    });

    if (!team) {
      throw new NotFoundException('서버로 부터 팀 정보를 찾을 수 없습니다.');
    }

    const userList = await this.usersRepository.find({
      where: {
        email: In(emails),
      },
    });

    const userIds = userList.map((user) => user.id);

    if (userList.length === 0) {
      throw new NotFoundException('서버로 부터 유저 정보를 찾을 수 없습니다.');
    }

    const isTeam = await this.teamMemberRepository.find({
      where: {
        user_id: In(userIds),
        team_id: teamId,
      },
    });

    if (isTeam.length > 0) {
      throw new BadRequestException(
        '이미 팀에 소속되어있는 유저가 존재합니다.',
      );
    }

    const values = {
      team_id: teamId,
      role: 'member',
      isActive: true,
    };

    await this.teamMemberRepository
      .createQueryBuilder()
      .insert()
      .into(TeamMember)
      .values(
        userIds.map((id) => {
          return {
            user_id: id,
            ...values,
          };
        }),
      )
      .execute();

    return {
      result: true,
      message: '해당 팀에 유저를 초대하였습니다.',
    };
  }

  async distroy(id: number, body: DistoryMember): Promise<ResultType> {
    const { teamId, userId } = body;
    if (!teamId || !userId) {
      throw new BadRequestException('올바르지 않은 데이터를 전송하였습니다.');
    }

    const team = await this.teamsRepository.findOneBy({
      id: teamId,
    });

    if (id !== team.creatorUserId) {
      throw new UnauthorizedException('팀 정보를 변경할 수 없는 권한입니다.');
    }

    const member = await this.teamMemberRepository.findOneBy({
      user_id: userId,
      team_id: teamId,
    });

    if (!member) {
      throw new NotFoundException(
        '서버로 부터 변경할 정보를 찾을 수 없습니다.',
      );
    }

    await this.teamMemberRepository.delete({
      id: member.id,
    });

    return {
      result: true,
      message: '멤버를 내보내기 하였습니다.',
      data: {
        member_id: member.id,
      },
    };
  }

  async unSubscribe(userId: number, teamId: number): Promise<ResultType> {
    if (!teamId) {
      throw new BadRequestException('올바르지 않은 데이터를 전송하였습니다.');
    }

    const team = await this.teamsRepository.findOneBy({
      id: teamId,
    });

    if (!team) {
      throw new NotFoundException('서버로 부터 팀 정보를 찾을 수 없습니다.');
    }

    const member = await this.teamMemberRepository.findOneBy({
      user_id: userId,
      team_id: teamId,
    });

    if (!member) {
      throw new NotFoundException('서버로 부터 멤버 정보를 찾을 수 없습니다.');
    }

    if (team.creatorUserId === userId || member.role === 'owner') {
      throw new BadRequestException('팀 생성자는 팀 나가기가 되지 않습니다.');
    }

    await this.teamMemberRepository.delete({
      id: member.id,
    });

    return {
      result: true,
      message: '팀에서 나가기가 완료되었습니다.',
    };
  }
}
