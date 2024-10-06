import { IsString, IsStrongPassword, IsEmail } from 'class-validator';

export class RegisterDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsStrongPassword({ minLength: 6, minSymbols: 0, minUppercase: 0 })
  password: string;
}
