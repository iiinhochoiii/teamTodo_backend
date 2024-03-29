import {
  Controller,
  UseGuards,
  Post,
  Body,
  Req,
  Get,
  Delete,
  Param,
  Put,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { TeamsService } from './teams.service';
import { CreateTeamDto } from './dto/createTeam.dto';
import { UpdateTeamDto } from './dto/updateTeam.dto';
import { InviteTeamDto } from './dto/inviteTeam.dto';
import { DistoryMember } from './dto/distroyMemeber.dto';

@Controller('teams')
export class TeamsController {
  constructor(private service: TeamsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Req() req: Request, @Body() body: CreateTeamDto) {
    const { user }: any = req;
    return this.service.create(user.id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  update(@Req() req: Request, @Body() body: UpdateTeamDto) {
    const { user }: any = req;
    return this.service.update(user.id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  find(@Req() req: Request) {
    const { user }: any = req;
    return this.service.find(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':name')
  findByTeamName(@Req() req: Request, @Param() params) {
    const { user }: any = req;
    return this.service.findByTeamName(user.id, params.name);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  deleteTeam(@Param() params) {
    return this.service.deleteTeam(params.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/checkTeam/:name')
  checkTeamName(@Param() params) {
    return this.service.checkTeamName(params.name);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/findAll')
  findAll() {
    return this.service.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Post('/invite')
  invite(@Body() body: InviteTeamDto) {
    return this.service.invite(body);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/distroy')
  distroyMember(@Req() req: Request, @Body() body: DistoryMember) {
    const { user }: any = req;
    return this.service.distroy(user.id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/unsubscribe/:teamId')
  unSubscribe(@Req() req: Request, @Param() params) {
    const { user }: any = req;
    const { teamId } = params;

    return this.service.unSubscribe(user.id, teamId);
  }
}
