import { IsNumber } from 'class-validator';

export class DistoryMember {
  @IsNumber()
  readonly teamId: number;

  @IsNumber()
  readonly userId: number;
}
