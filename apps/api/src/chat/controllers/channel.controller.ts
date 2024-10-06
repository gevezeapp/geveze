import { Controller, Get, UseGuards, Req, Query } from '@nestjs/common';
import { ChatAuthGuard } from '../auth.guard';
import { QueryBus } from '@nestjs/cqrs';
import { ListChannelsQuery } from '../queries/list-channels.query';
import { ListChannelsDto } from '../dtos/list-channels.dto';

@UseGuards(ChatAuthGuard)
@Controller('chat/channels')
export class ChannelController {
  constructor(private queryBus: QueryBus) {}

  @Get('')
  async getChannels(@Req() req, @Query() query: ListChannelsDto) {
    return this.queryBus.execute(
      new ListChannelsQuery(req.user._id, query.page || 1),
    );
  }
}
