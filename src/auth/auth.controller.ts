import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from './dto/createUser.dto';

@Controller('auth')
export class AuthController {
  constructor(private service: AuthService) {}

  @Post('login')
  login(@Body() data: LoginDto) {
    return this.service.login(data);
  }

  @Post('create')
  create(@Body() data: CreateUserDto) {
    return this.service.createUser(data);
  }
}
