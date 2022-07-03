import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { EmailService } from './email.service';
import { CertifyDto } from './dto/certify.dto';

@Controller('email')
export class EmailController {
  constructor(private service: EmailService) {}

  // 이메일 확인 후, 인증번호 전송
  @Get('/verification/:email')
  verification(@Param('email') _email: string) {
    return this.service.verification(_email);
  }

  // 인증번호 검증
  @Post('/certify')
  certify(@Body() data: CertifyDto) {
    return this.service.certify(data);
  }

  @Get('/')
  findAll() {
    return this.service.findAll();
  }
}
