import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, Payload } from '@nestjs/microservices';

@Controller()
export class EventsController {
  @EventPattern('NEW_MESSAGE')
  async getNotifications(@Payload() data: any, @Ctx() context: any) {
    context.server.to('66fd9eaaac5d98b7fce53a8c').emit('mexsage', data);
  }
}
