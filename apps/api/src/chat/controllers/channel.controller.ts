import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { ChatAuthGuard } from '../auth.guard';
import { QueryBus } from '@nestjs/cqrs';
import { ListChannelsQuery } from '../queries/list-channels.query';

@UseGuards(ChatAuthGuard)
@Controller('chat/channels')
export class ChannelController {
  constructor(private queryBus: QueryBus) {}

  @Get('')
  async getChannels(@Req() req) {
    return this.queryBus.execute(new ListChannelsQuery(req.user._id, 1));
  }
}
