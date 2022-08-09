import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Team } from './team.entity';
import { Repository } from 'typeorm';
import { ResultType } from '../interfaces/common';

@Injectable()
export class TeamsService {
  constructor(@InjectRepository(Team) private repository: Repository<Team>) {}

  async create(id: number, body: any): Promise<ResultType | any> {
    return {
      id,
      body,
    };
  }
}
