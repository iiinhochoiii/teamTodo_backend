import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { Team } from './team.entity';
import { TeamMember } from '../teamMembers/teamMember.entity';

import { TeamsController } from './teams.controller';
import { TeamsService } from './teams.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Team, TeamMember])],
  controllers: [TeamsController],
  providers: [TeamsService],
})
export class TeamsModule {}
