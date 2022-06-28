import { Controller, Get, Param } from '@nestjs/common';

import { EmailService } from './email.service';

@Controller('email')
export class EmailController {
  constructor(private service: EmailService) {}

  @Get('/verification/:email')
  verification(@Param('email') _email: string) {
    return this.service.verification(_email);
  }
}
