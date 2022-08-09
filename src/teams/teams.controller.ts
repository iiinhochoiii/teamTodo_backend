import { Controller, UseGuards, Post, Body, Req } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { TeamsService } from './teams.service';
import { CreateTeamDto } from './dto/createTeam.dto';

@Controller('teams')
export class TeamsController {
  constructor(private service: TeamsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Req() req: Request, @Body() body: CreateTeamDto) {
    const { user }: any = req;
    return this.service.create(user.id, body);
  }
}
