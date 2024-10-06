import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ListUsersQuery } from '../queries/list-users.query';
import { ChatUser, ChatUserModel, ProjectModel } from '@geveze/db';

@QueryHandler(ListUsersQuery)
export class ListUsersHandler implements IQueryHandler<ListUsersQuery> {
  async execute(query: ListUsersQuery): Promise<ChatUser[]> {
    const project = await ProjectModel.findOne({ key: query.project });
    const users = await ChatUserModel.find({ project: project._id });
    return users;
  }
}
