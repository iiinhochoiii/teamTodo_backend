import {
  Controller,
  Post,
  Body,
  Get,
  Put,
  Delete,
  Param,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { EmailService } from '../email/email.service';

@Controller('users')
export class UsersController {
  constructor(
    private service: UsersService,
    private emailService: EmailService,
  ) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  get(@Param() params) {
    return this.service.getUser(params.id);
  }

  @Post()
  create(@Body() user: User) {
    return this.service.createUser(user);
  }

  @Put()
  update(@Body() user: User) {
    return this.service.updateUser(user);
  }

  @Delete(':id')
  deleteUser(@Param() params) {
    return this.service.deleteUser(params.id);
  }

  @Get('/verification/:email')
  verification(@Param('email') _email: string) {
    return this.emailService.verification(_email);
  }
}
