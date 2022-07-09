import { IsNumber, IsArray } from 'class-validator';

export class CreateContentDto {
  @IsNumber()
  readonly creatorUserId: number;

  @IsArray()
  readonly plan: string[];

  @IsArray()
  readonly happend: string[];
}
