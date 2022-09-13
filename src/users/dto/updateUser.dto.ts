import { IsString } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  readonly password: string;

  @IsString()
  readonly name: string;

  @IsString()
  readonly phone: string;

  @IsString()
  readonly profile: string;

  @IsString()
  readonly position: string;
}
