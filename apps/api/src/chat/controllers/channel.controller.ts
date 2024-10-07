import {
  Controller,
  Get,
  UseGuards,
  Req,
  Query,
  Param,
  Body,
  Post,
} from '@nestjs/common';
import { ChatAuthGuard } from '../auth.guard';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ListChannelsQuery } from '../queries/list-channels.query';
import { ListChannelsDto } from '../dtos/list-channels.dto';
import { GetChannelQuery } from '../queries/get-channel.query';
import { CreateChannelCommand } from '../commands/create-channel.command';
import { MarkAsReadCommand } from '../commands/mark-as-read.command';

@UseGuards(ChatAuthGuard)
@Controller('chat/channels')
export class ChannelController {
  constructor(private queryBus: QueryBus, private commandBus: CommandBus) {}

  @Get('')
  async getChannels(@Req() req, @Query() query: ListChannelsDto) {
    return this.queryBus.execute(
      new ListChannelsQuery(req.user._id, query.page || 1),
    );
  }

  @Get(':channel')
  async getChannel(@Req() req, @Param() params) {
    return this.queryBus.execute(
      new GetChannelQuery(req.user._id, params.channel),
    );
  }

  @Post('')
  async createChannel(@Req() req, @Body() body) {
    return this.commandBus.execute(
      new CreateChannelCommand(body.user, req.user._id),
    );
  }
  @Post('mark-as-read')
  async markAsRead(@Req() req, @Body() body) {
    return this.commandBus.execute(
      new MarkAsReadCommand(body.channel, req.user._id),
    );
  }
}
