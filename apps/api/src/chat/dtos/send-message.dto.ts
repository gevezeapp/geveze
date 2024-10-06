import { IsString } from 'class-validator';

export class SendMessageDto {
  @IsString()
  toUser: string;

  @IsString()
  message: string;
}
