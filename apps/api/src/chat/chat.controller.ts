import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { ChatUserModel } from 'src/models/ChatUser';
import { ProjectMemberModel, ProjectModel } from 'src/models/Project';
import { TokenCommand } from './commands/token.command';

@Controller('chat')
export class ChatController {
  constructor(private commandBus: CommandBus) {}

  @Post('token')
  async initSession(@Body() body) {
    return this.commandBus.execute(new TokenCommand(body.project, body.id));
  }
}
