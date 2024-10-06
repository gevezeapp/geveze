import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ListChannelsQuery } from '../queries/list-channels.query';
import { ChannelMember, ChannelMemberModel } from '@geveze/db';

@QueryHandler(ListChannelsQuery)
export class ListChannelsHandler implements IQueryHandler<ListChannelsQuery> {
  async execute(query: ListChannelsQuery): Promise<ChannelMember[]> {
    const channels = await ChannelMemberModel.find({ user: query.user });
    return channels;
  }
}
