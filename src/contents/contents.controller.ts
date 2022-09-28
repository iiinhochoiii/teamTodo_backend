import {
  Controller,
  UseGuards,
  Post,
  Get,
  Body,
  Put,
  Delete,
  Param,
  Req,
  Query,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { CreateContentDto } from './dto/createContent.dto';
import { UpdateContentDto } from './dto/updateContent.dto';
import { FindContentDto } from './dto/findContent.dto';
import { ContentsService } from './contents.service';

@Controller('contents')
export class ContentsController {
  constructor(private service: ContentsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  find(@Req() req: Request, @Query() query: FindContentDto) {
    const { user }: any = req;
    return this.service.findAll(user.id, query);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':teamId')
  findByTeam(@Param() param, @Query() query: FindContentDto) {
    return this.service.findByTeam(param.teamId, query);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() content: CreateContentDto) {
    return this.service.create(content);
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  update(@Body() content: UpdateContentDto) {
    return this.service.update(content);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Param() param) {
    return this.service.delete(param.id);
  }
}
