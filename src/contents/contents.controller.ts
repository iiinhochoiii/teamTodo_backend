import { Controller, UseGuards, Post, Get, Body } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { CreateContentDto } from './dto/createContent.dto';
import { ContentsService } from './contents.service';

@Controller('contents')
export class ContentsController {
  constructor(private service: ContentsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  find() {
    return this.service.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() content: CreateContentDto) {
    return this.service.create(content);
  }
}
