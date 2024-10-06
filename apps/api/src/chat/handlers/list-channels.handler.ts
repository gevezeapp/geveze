import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ListChannelsQuery } from '../queries/list-channels.query';
import { ChannelMemberModel } from 'src/models/Channel';

@QueryHandler(ListChannelsQuery)
export class ListChannelsHandler implements IQueryHandler<ListChannelsQuery> {
  async execute(query: ListChannelsQuery): Promise<any> {
    const channels = await ChannelMemberModel.find({ user: query.user });
    return channels;
  }
}
