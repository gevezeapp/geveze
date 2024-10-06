import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  IncomingEvent,
  IncomingRequest,
  RedisContext,
  ServerRedis,
} from '@nestjs/microservices';
import { isUndefined } from '@nestjs/common/utils/shared.utils';
import { EventsGateway } from './events/events.gateway';
import { Server } from 'socket.io';

class RedisWSContext extends RedisContext {
  server: Server;
  constructor(args, server) {
    super(args);
    this.server = server;
  }
}

class ServerRedisEx extends ServerRedis {
  gateway: EventsGateway;
  constructor(options, gateway) {
    super(options);
    this.gateway = gateway;
  }

  async handleMessage(channel, buffer, pub, pattern) {
    const rawMessage = this.parseMessage(buffer);
    const packet = (await this.deserializer.deserialize(rawMessage, {
      channel,
    })) as (IncomingRequest | IncomingEvent) & { id: string };
    const redisCtx = new RedisWSContext([pattern], this.gateway.server);

    if (isUndefined(packet.id)) {
      return this.handleEvent(channel, packet, redisCtx);
    }
    const publish = this.getPublisher(pub, channel, packet.id);
    const handler = this.getHandlerByPattern(channel);
    if (!handler) {
      const status = 'error';
      const noHandlerPacket = {
        id: packet.id,
        status,
        err: 'NO_MESSAGE_HANDLER',
      };
      return publish(noHandlerPacket);
    }
    const response$ = this.transformToObservable(
      await handler(packet.data, redisCtx),
    );
    response$ && this.send(response$, publish);
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const ms = await NestFactory.createMicroservice(AppModule, {
    strategy: new ServerRedisEx(
      {
        url: 'redis://localhost:6379',
      },
      app.get(EventsGateway),
    ),
  });
  app.enableCors();
  await app.listen(5000);
  await ms.listen();
}
bootstrap();
