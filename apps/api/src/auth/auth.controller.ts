import { Body, Controller, Post } from '@nestjs/common';
import { LoginDto } from './dtos/login.dto';
import { RegisterDto } from './dtos/register.dto';
import { CommandBus } from '@nestjs/cqrs';
import { LoginCommand } from './commands/login-command';
import { RegisterCommand } from './commands/register-command';

@Controller('auth')
export class AuthController {
  constructor(private commandBus: CommandBus) {}

  @Post('register')
  async register(@Body() body: RegisterDto) {
    return this.commandBus.execute(
      new RegisterCommand(body.email, body.password, body.name),
    );
  }

  @Post('login')
  async login(@Body() body: LoginDto) {
    return this.commandBus.execute(new LoginCommand(body.email, body.password));
  }
}
