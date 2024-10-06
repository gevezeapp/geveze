import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ListMessagesQuery } from '../queries/list-messages.query';
import { Message, MessageModel } from '@geveze/db';

@QueryHandler(ListMessagesQuery)
export class ListMessagesHandler implements IQueryHandler<ListMessagesQuery> {
  async execute(query: ListMessagesQuery): Promise<Message[]> {
    const messages = await MessageModel.find({ channel: query.channel });
    return messages;
  }
}
