import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { TokenCommand } from './commands/token.command';

@Controller('chat')
export class ChatController {
  constructor(private commandBus: CommandBus) {}

  @Post('token')
  async initSession(@Body() body) {
    return this.commandBus.execute(new TokenCommand(body.project, body.id));
  }
}
