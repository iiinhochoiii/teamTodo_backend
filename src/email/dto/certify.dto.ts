import { IsString } from 'class-validator';

export class CertifyDto {
  @IsString()
  readonly email: string;

  @IsString()
  readonly certificationNumber: string;
}
