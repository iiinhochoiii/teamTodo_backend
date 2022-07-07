import {
  Controller,
  Post,
  Body,
  Get,
  Put,
  Delete,
  Param,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { CreateUserDto } from './dto/createUser.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller('users')
export class UsersController {
  constructor(private service: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  get(@Param() params) {
    return this.service.getUser(params.id);
  }

  @Post()
  create(@Body() data: CreateUserDto) {
    return this.service.createUser(data);
  }

  @Put()
  update(@Body() user: User) {
    return this.service.updateUser(user);
  }

  @Delete(':id')
  deleteUser(@Param() params) {
    return this.service.deleteUser(params.id);
  }
}
