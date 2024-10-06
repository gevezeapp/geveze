import {
  Body,
  Controller,
  Post,
  Request,
  Get,
  UseGuards,
  Req,
  Param,
  Inject,
  Query,
} from '@nestjs/common';
import { ChatAuthGuard } from '../auth.guard';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ListChannelsQuery } from '../queries/list-channels.query';
import { ListChannelsDto } from '../dtos/list-channels.dto';

@UseGuards(ChatAuthGuard)
@Controller('chat/channels')
export class ChannelController {
  constructor(private commandBus: CommandBus, private queryBus: QueryBus) {}

  @Get('')
  async getChannels(@Req() req) {
    return this.queryBus.execute(new ListChannelsQuery(req.user._id, 1));
  }
}
