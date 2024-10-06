import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ChannelMember, ChannelMemberModel, ChannelModel } from '@geveze/db';
import mongoose from 'mongoose';
import { GetChannelQuery } from '../queries/get-channel.query';
import { Channel } from 'diagnostics_channel';
import { NotFoundException } from '@nestjs/common';

@QueryHandler(GetChannelQuery)
export class GetChannelHandler implements IQueryHandler<GetChannelQuery> {
  async execute(query: GetChannelQuery): Promise<Channel> {
    const channels = await ChannelMemberModel.listChannels({
      limit: 1,
      skip: 0,
      user: query.user,
      channel: query.channel,
    });

    if (!channels[0]) throw new NotFoundException('Channel not found!');

    return channels[0];
  }
}
