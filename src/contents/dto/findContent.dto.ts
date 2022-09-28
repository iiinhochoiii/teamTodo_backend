import { IsOptional, IsString } from 'class-validator';

export class FindContentDto {
  @IsString()
  @IsOptional()
  page?: number | 1;

  @IsString()
  @IsOptional()
  pageSize?: number | 10;
}
