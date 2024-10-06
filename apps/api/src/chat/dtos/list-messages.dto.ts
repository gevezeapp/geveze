import { Type } from 'class-transformer';
import { IsMongoId, IsNumber, IsOptional, Min } from 'class-validator';

export class ListMessagesDto {
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  @IsOptional()
  page?: number;
}

export class ListMessagesParamsDto {
  @IsMongoId()
  channel: string;
}
