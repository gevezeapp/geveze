import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { ChatAuthGuard } from '../auth.guard';
import { QueryBus } from '@nestjs/cqrs';
import { ListUsersQuery } from '../queries/list-users.query';

@UseGuards(ChatAuthGuard)
@Controller('chat/users')
export class UserController {
  constructor(private queryBus: QueryBus) {}

  @Get('')
  async listUsers(@Req() req) {
    return this.queryBus.execute(new ListUsersQuery(req.user.project));
  }
}
