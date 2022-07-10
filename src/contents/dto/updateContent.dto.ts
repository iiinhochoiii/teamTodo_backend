import { IsNumber, IsArray } from 'class-validator';

export class UpdateContentDto {
  @IsNumber()
  readonly id: number;

  @IsArray()
  readonly plan: string[];

  @IsArray()
  readonly happend: string[];
}
