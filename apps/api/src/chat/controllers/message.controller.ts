import {
  Body,
  Controller,
  Post,
  UseGuards,
  Req,
  Get,
  Param,
  Query,
  ParseFloatPipe,
} from '@nestjs/common';
import { ChatAuthGuard } from '../auth.guard';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { SendMessageCommand } from '../commands/send-message.command';
import { SendMessageDto } from '../dtos/send-message.dto';
import { ListMessagesQuery } from '../queries/list-messages.query';
import {
  ListMessagesDto,
  ListMessagesParamsDto,
} from '../dtos/list-messages.dto';

@UseGuards(ChatAuthGuard)
@Controller('chat/messages')
export class MessageController {
  constructor(private commandBus: CommandBus, private queryBus: QueryBus) {}

  @Get(':channel')
  async listMessages(
    @Param() params: ListMessagesParamsDto,
    @Req() req,
    @Query() query: ListMessagesDto,
  ) {
    return this.queryBus.execute(
      new ListMessagesQuery(params.channel, req.user._id, query.page || 1),
    );
  }

  @Post('')
  async sendMessage(@Body() body: SendMessageDto, @Req() req) {
    return this.commandBus.execute(
      new SendMessageCommand(body.channel, body.message, req.user._id),
    );
  }
}
