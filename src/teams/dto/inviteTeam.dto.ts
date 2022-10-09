import { IsNumber, IsArray } from 'class-validator';

export class InviteTeamDto {
  @IsNumber()
  readonly teamId: number;

  @IsArray()
  readonly emails: string[];
}
