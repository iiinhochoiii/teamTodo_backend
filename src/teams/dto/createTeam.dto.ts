import { IsString, IsOptional } from 'class-validator';

export class CreateTeamDto {
  @IsString()
  readonly name: string;

  @IsOptional()
  readonly description: string;

  @IsOptional()
  readonly maskcot: string;
}
