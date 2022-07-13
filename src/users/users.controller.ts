import {
  Controller,
  Body,
  Get,
  Put,
  Delete,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { UpdateUserDto } from './dto/updateUser.dto';

@Controller('users')
export class UsersController {
  constructor(private service: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.service.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  get(@Param() params) {
    return this.service.getUser(params.id);
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  update(@Req() req: Request, @Body() body: UpdateUserDto) {
    const { user }: any = req;
    return this.service.updateUser(user.id, body);
  }

  @Delete(':id')
  deleteUser(@Param() params) {
    return this.service.deleteUser(params.id);
  }
}
