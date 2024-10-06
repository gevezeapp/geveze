import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { MessageController } from './controllers/message.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { SendMessageHandler } from './handlers/send-message.handler';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TokenHandler } from './handlers/token.handler';
import { ChannelController } from './controllers/channel.controller';
import { ListChannelsHandler } from './handlers/list-channels.handler';
import { ListUsersHandler } from './handlers/list-users.handler';
import { UserController } from './controllers/user.controller';
import { ListMessagesHandler } from './handlers/list-messages.handler';
import { GetChannelHandler } from './handlers/get-channel.handler';
import { GetUserHandler } from './handlers/get-user.handler';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'WS_SERVICE',
        transport: Transport.REDIS,
        options: {
          host: 'localhost',
          port: 6379,
        },
      },
    ]),
    CqrsModule,
  ],
  controllers: [
    ChatController,
    MessageController,
    ChannelController,
    UserController,
  ],
  providers: [
    SendMessageHandler,
    TokenHandler,
    ListChannelsHandler,
    ListUsersHandler,
    ListMessagesHandler,
    GetChannelHandler,
    GetUserHandler,
  ],
})
export class ChatModule {}
