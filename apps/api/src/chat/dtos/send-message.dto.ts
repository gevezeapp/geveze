import { IsMongoId, IsString } from 'class-validator';

export class SendMessageDto {
  @IsMongoId()
  channel: string;

  @IsString()
  message: string;
}
