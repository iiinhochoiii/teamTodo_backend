import { Module } from '@nestjs/common';
import { ContentsController } from './contents.controller';
import { ContentsService } from './contents.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Content } from './content.entity';
import { Team } from '../teams/team.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Content, Team])],
  controllers: [ContentsController],
  providers: [ContentsService],
})
export class ContentsModule {}
