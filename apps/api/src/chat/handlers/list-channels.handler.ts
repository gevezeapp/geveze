import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ListChannelsQuery } from '../queries/list-channels.query';
import { ChannelMember, ChannelMemberModel, ChannelModel } from '@geveze/db';
import mongoose from 'mongoose';

@QueryHandler(ListChannelsQuery)
export class ListChannelsHandler implements IQueryHandler<ListChannelsQuery> {
  async execute(query: ListChannelsQuery): Promise<{
    channels: ChannelMember[];
    total: number;
    hasNextPage: boolean;
  }> {
    const limit = 20;
    const page = query.page;
    const skip = (page - 1) * limit;

    const filter = { user: query.user };

    const channels = await ChannelMemberModel.listChannels({
      ...filter,
      skip,
      limit,
    });

    const total = await ChannelMemberModel.countDocuments(filter);

    const hasNextPage = false;

    return { channels, total, hasNextPage };
  }
}
