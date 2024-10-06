import { Controller } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  Payload,
  RedisContext,
} from '@nestjs/microservices';
import { Server } from 'socket.io';

@Controller()
export class EventsController {
  @EventPattern('NEW_MESSAGE')
  async getNotifications(
    @Payload()
    data: {
      channel: { members: { user: string }[] };
      message: { message: string };
      to: string[];
    },
    @Ctx() context: RedisContext & { server: Server },
  ) {
    context.server.to(data.to).emit('NEW_MESSAGE', data);
  }
}
