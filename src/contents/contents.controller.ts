import {
  Controller,
  UseGuards,
  Post,
  Get,
  Body,
  Put,
  Delete,
  Param,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { CreateContentDto } from './dto/createContent.dto';
import { UpdateContentDto } from './dto/updateContent.dto';
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
