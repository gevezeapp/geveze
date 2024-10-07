import { Controller, Get, UseGuards, Req, Query, Param } from '@nestjs/common';
import { ChatAuthGuard } from '../auth.guard';
import { QueryBus } from '@nestjs/cqrs';
import { ListUsersQuery } from '../queries/list-users.query';
import { ListUsersDto } from '../dtos/list-users.dto';
import { GetUserQuery } from '../queries/get-user.query';

@UseGuards(ChatAuthGuard)
@Controller('chat/users')
export class UserController {
  constructor(private queryBus: QueryBus) {}

  @Get('')
  async listUsers(
    @Req() req,
    @Query()
    query: ListUsersDto,
  ) {
    return this.queryBus.execute(
      new ListUsersQuery(
        req.user.project,
        query.page || 1,
        req.user._id,
        query.q,
      ),
    );
  }

  @Get(':externalId')
  async getUser(@Req() req, @Param('externalId') externalId: string) {
    return this.queryBus.execute(
      new GetUserQuery(externalId, req.user.project),
    );
  }
}
