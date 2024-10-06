import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ListMessagesQuery } from '../queries/list-messages.query';
import { MessageModel } from 'src/models/Message';

@QueryHandler(ListMessagesQuery)
export class ListMessagesHandler implements IQueryHandler<ListMessagesQuery> {
  async execute(query: ListMessagesQuery): Promise<any> {
    const messages = await MessageModel.find({ channel: query.channel });
    return messages;
  }
}
