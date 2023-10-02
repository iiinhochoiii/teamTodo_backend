import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { CreateContentDto } from './dto/createContent.dto';
import { UpdateContentDto } from './dto/updateContent.dto';
import { FindContentDto } from './dto/findContent.dto';

import { Content } from './content.entity';
import { ResultType } from '../interfaces/common';
import { User } from '../users/user.entity';
import { Team } from '../teams/team.entity';

@Injectable()
export class ContentsService {
  constructor(
    @InjectRepository(Content) private repository: Repository<Content>,
    @InjectRepository(Team) private teamsRepository: Repository<Team>,
  ) {}

  async create(content: CreateContentDto): Promise<any> {
    const { creatorUserId, happend, plan, teamId } = content;

    if (!content.creatorUserId) {
      throw new BadRequestException('올바르지 않은 데이터를 전송하였습니다.');
    }

    await this.repository.save({
      creatorUserId,
      happend,
      plan,
      createdAt: new Date(),
      teamId,
    });

    const team = teamId
      ? await this.teamsRepository.findOneBy({ id: teamId })
      : undefined;

    return {
      result: true,
      message: '컨텐츠가 등록 되었습니다.',
      ...(team && {
        teamName: team.name,
      }),
    };
  }

  async update(body: UpdateContentDto): Promise<ResultType> {
    const { id, happend, plan } = body;

    if (!id) {
      throw new BadRequestException('올바르지 않은 데이터를 전송하였습니다.');
    }

    const content = await this.repository.findOneBy({ id });

    if (!content) {
      throw new NotFoundException(
        '서버로 부터 변경하는 데이터를 찾을 수 없습니다.',
      );
    }

    await this.repository.update(content.id, {
      happend: happend,
      plan: plan,
      updatedAt: new Date(),
    });

    return {
      result: true,
      message: '콘텐츠가 변경되었습니다.',
    };
  }

  async findAll(id: number, pageOption: FindContentDto): Promise<ResultType> {
    const { page = 1, pageSize = 10 } = pageOption;

    const offset = (page - 1) * pageSize;

    const total = await this.repository.countBy({
      creatorUserId: id,
      teamId: IsNull(),
    });

    const contents = await this.repository
      .createQueryBuilder('content')
      .leftJoinAndMapOne(
        'content.user',
        User,
        'user',
        'content.creatorUserId = user.id',
      )
      .select([
        'content',
        'user.id',
        'user.name',
        'user.email',
        'user.lastLoginedAt',
        'user.phone',
        'user.profile',
        'user.position',
      ])
      .where('content.creatorUserId = :id AND content.teamId IS NULL', {
        id: id,
      })
      .orderBy('content.id', 'DESC')
      .offset(offset)
      .limit(pageSize)
      .getMany();

    return {
      data: contents,
      page: {
        offset: Number(offset),
        limit: Number(pageSize),
        total: total,
        hasNext: Number(offset) + Number(pageSize) < total,
      },
    };
  }

  async findByTeam(
    teamId: number,
    pageOption: FindContentDto,
  ): Promise<ResultType> {
    const { page = 1, pageSize = 10 } = pageOption;

    const offset = (page - 1) * pageSize;

    const total = await this.repository.countBy({
      teamId: teamId,
    });

    const contents = await this.repository
      .createQueryBuilder('content')
      .leftJoinAndMapOne(
        'content.user',
        User,
        'user',
        'content.creatorUserId = user.id',
      )
      .select([
        'content',
        'user.id',
        'user.name',
        'user.email',
        'user.lastLoginedAt',
        'user.phone',
        'user.profile',
        'user.position',
      ])
      .where('content.teamId = :teamId', {
        teamId,
      })
      .orderBy('content.id', 'DESC')
      .getMany();

    return {
      data: contents,
      page: {
        offset: Number(offset),
        limit: Number(pageSize),
        total: total,
        hasNext: Number(offset) + Number(pageSize) < total,
      },
    };
  }

  async delete(id: number): Promise<ResultType> {
    if (!id) {
      throw new BadRequestException('id가 전달되지 않았습니다.');
    }

    const content = await this.repository.findOneBy({ id });

    if (!content) {
      throw new NotFoundException('삭제할 데이터를 찾을 수 없습니다.');
    }

    await this.repository.delete(content.id);

    return {
      result: true,
      message: '콘텐츠가 삭제되었습니다.',
    };
  }
}
