import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ListMessagesQuery } from '../queries/list-messages.query';
import { ChannelMemberModel, Message, MessageModel } from '@geveze/db';
import { NotFoundException } from '@nestjs/common';

@QueryHandler(ListMessagesQuery)
export class ListMessagesHandler implements IQueryHandler<ListMessagesQuery> {
  async execute(
    query: ListMessagesQuery,
  ): Promise<{ messages: Message[]; total: number; hasNextPage: boolean }> {
    const membership = await ChannelMemberModel.findOne({
      channel: query.channel,
      user: query.user,
    }).lean();

    if (!membership) throw new NotFoundException('Channel not found!');

    const limit = 20;
    const page = query.page;
    const skip = (page - 1) * limit;

    const filter = { channel: membership.channel };

    const messages = await MessageModel.find(
      filter,
      { channel: 0, __v: 0 },
      { sort: { createdAt: -1 } },
    )
      .limit(limit)
      .skip(skip)
      .populate({
        path: 'sender',
        select: { id: 'externalId', _id: 0, displayName: 1, username: 1 },
      });

    const total = await MessageModel.countDocuments(filter);
    const hasNextPage = total > page * limit;

    return { messages, total, hasNextPage };
  }
}
