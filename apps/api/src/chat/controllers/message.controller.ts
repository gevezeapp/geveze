import {
  Body,
  Controller,
  Post,
  UseGuards,
  Req,
  Get,
  Param,
} from '@nestjs/common';
import { ChatAuthGuard } from '../auth.guard';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { SendMessageCommand } from '../commands/send-message.command';
import { SendMessageDto } from '../dtos/send-message.dto';
import { ListMessagesQuery } from '../queries/list-messages.query';

@UseGuards(ChatAuthGuard)
@Controller('chat/messages')
export class MessageController {
  constructor(private commandBus: CommandBus, private queryBus: QueryBus) {}

  @Get(':channel')
  async listMessages(@Param('channel') channel: string, @Req() req) {
    return this.queryBus.execute(new ListMessagesQuery(channel, 1));
  }

  @Post('')
  async sendMessage(@Body() body: SendMessageDto, @Req() req) {
    return this.commandBus.execute(
      new SendMessageCommand(body.toUser, body.message, req.user._id),
    );
  }
}
