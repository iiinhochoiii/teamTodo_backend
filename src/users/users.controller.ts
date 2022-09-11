import {
  Controller,
  Body,
  Get,
  Delete,
  Param,
  Req,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { Request } from 'express';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { UpdateUserDto } from './dto/updateUser.dto';

@Controller('users')
export class UsersController {
  constructor(private service: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('my')
  findMy(@Req() req: Request) {
    const { user }: any = req;
    return this.service.findMy(user.id);
  }

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
  @Patch()
  update(@Req() req: Request, @Body() body: UpdateUserDto) {
    const { user }: any = req;
    return this.service.updateUser(user.id, body);
  }

  @Delete(':id')
  deleteUser(@Param() params) {
    return this.service.deleteUser(params.id);
  }
}
