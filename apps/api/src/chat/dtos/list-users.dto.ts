import { Type } from 'class-transformer';
import { IsNumber, IsString, Min } from 'class-validator';

export class ListUsersDto {
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  page: number;

  @IsString()
  q?: string;
}
