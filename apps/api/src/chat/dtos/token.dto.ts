import { IsString } from 'class-validator';

export class TokenDto {
  @IsString()
  project: string;

  @IsString()
  id: string;
}
