import { IsNumber, IsString } from 'class-validator';

export class ListChannelsDto {
  @IsNumber()
  page: number;
}
