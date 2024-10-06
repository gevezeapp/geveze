import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ListUsersQuery } from '../queries/list-users.query';
import { ChatUserModel } from 'src/models/ChatUser';
import { Project, ProjectModel } from 'src/models/Project';

@QueryHandler(ListUsersQuery)
export class ListUsersHandler implements IQueryHandler<ListUsersQuery> {
  async execute(query: ListUsersQuery): Promise<any> {
    const project = await ProjectModel.findOne({ key: query.project });
    const users = await ChatUserModel.find({ project: project._id });
    return users;
  }
}
