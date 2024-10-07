import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { MessageController } from './controllers/message.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { SendMessageHandler } from './handlers/send-message.handler';
import {
  ClientProxyFactory,
  ClientsModule,
  Transport,
} from '@nestjs/microservices';
import { TokenHandler } from './handlers/token.handler';
import { ChannelController } from './controllers/channel.controller';
import { ListChannelsHandler } from './handlers/list-channels.handler';
import { ListUsersHandler } from './handlers/list-users.handler';
import { UserController } from './controllers/user.controller';
import { ListMessagesHandler } from './handlers/list-messages.handler';
import { GetChannelHandler } from './handlers/get-channel.handler';
import { GetUserHandler } from './handlers/get-user.handler';
import { CreateChannelHandler } from './handlers/create-channel-handler';
import { MarkAsReadHandler } from './handlers/mark-as-read.handler';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [CqrsModule],
  controllers: [
    ChatController,
    MessageController,
    ChannelController,
    UserController,
  ],
  providers: [
    {
      provide: 'WS_SERVICE',
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create({
          transport: Transport.REDIS,
          options: {
            host: configService.get('redis_host'),
            port: configService.get('redis_port'),
          },
        });
      },
      inject: [ConfigService],
    },
    SendMessageHandler,
    TokenHandler,
    ListChannelsHandler,
    ListUsersHandler,
    ListMessagesHandler,
    GetChannelHandler,
    GetUserHandler,
    CreateChannelHandler,
    MarkAsReadHandler,
  ],
})
export class ChatModule {}
