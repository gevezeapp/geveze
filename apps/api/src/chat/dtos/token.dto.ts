import { IsJWT, IsString } from 'class-validator';

export class TokenDto {
  @IsString()
  project: string;

  @IsJWT()
  token: string;
}
