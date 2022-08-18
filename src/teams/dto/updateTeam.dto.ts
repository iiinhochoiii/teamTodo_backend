import { IsString, IsOptional, IsNumber } from 'class-validator';

export class UpdateTeamDto {
  @IsNumber()
  readonly id: number;

  @IsString()
  readonly name: string;

  @IsOptional()
  readonly description: string;

  @IsOptional()
  readonly maskcot: string;
}
