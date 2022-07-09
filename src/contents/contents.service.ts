import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateContentDto } from './dto/createContent.dto';
import { Content } from './content.entity';

@Injectable()
export class ContentsService {
  constructor(
    @InjectRepository(Content) private repository: Repository<Content>,
  ) {}

  async create(content: CreateContentDto): Promise<{
    result: boolean;
    message: string;
  }> {
    const { creatorUserId, happend, plan } = content;

    if (!content.creatorUserId) {
      throw new BadRequestException('올바르지 않은 데이터를 전송하였습니다.');
    }

    await this.repository.save({
      creatorUserId,
      happend,
      plan,
      createdAt: new Date(),
    });

    return {
      result: true,
      message: '컨텐츠가 등록 되었습니다.',
    };
  }

  async findAll() {
    return this.repository.find();
  }
}
