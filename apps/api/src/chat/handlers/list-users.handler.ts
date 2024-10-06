import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ListUsersQuery } from '../queries/list-users.query';
import { ChatUser, ChatUserModel, ProjectModel } from '@geveze/db';

@QueryHandler(ListUsersQuery)
export class ListUsersHandler implements IQueryHandler<ListUsersQuery> {
  async execute(query: ListUsersQuery): Promise<{
    users: ChatUser[];
    hasNextPage: boolean;
    total: number;
    page: number;
  }> {
    const limit = 20;
    const page = query.page || 1;
    const skip = (page - 1) * limit;

    const project = await ProjectModel.findOne({ key: query.project });

    const filter = {
      project: project._id,
      ...(query.q && {
        $or: [
          { displayName: { $regex: query.q, $options: 'i' } },
          { username: { $regex: query.q, $options: 'i' } },
        ],
      }),
    };

    const users = await ChatUserModel.find(
      filter,
      {},
      {
        projection: {
          id: '$externalId',
          _id: 0,
          username: 1,
          displayName: 1,
          profilePicture: 1,
        },
      },
    )
      .limit(limit)
      .skip(skip);

    const total = await ChatUserModel.countDocuments(filter);

    const hasNextPage = total > limit * page;

    return { users, total, hasNextPage, page };
  }
}
