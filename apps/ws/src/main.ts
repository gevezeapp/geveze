// @ts-nocheck
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  BaseRpcContext,
  MicroserviceOptions,
  ReadPacket,
  ServerRedis,
  Transport,
} from '@nestjs/microservices';
import {
  CustomTransportStrategy,
  Server,
  RedisContext,
} from '@nestjs/microservices';
import * as constants from '@nestjs/microservices/constants';
import * as utils from '@nestjs/common/utils/shared.utils';
import { ConsumerDeserializer, IncomingRequest } from '@nestjs/microservices';
import { EventsGateway } from './events/events.gateway';
let redisPackage = {};
class Rds extends Server implements ServerRedis {
  constructor(options, ws) {
    super();
    this.ws = ws;
    this.options = options;
    this.transportId = Transport.REDIS;
    this.isExplicitlyTerminated = false;
    redisPackage = this.loadPackage('ioredis', ServerRedis.name, () =>
      require('ioredis'),
    );
    this.initializeSerializer(options);
    this.initializeDeserializer(options);
  }
  listen(callback) {
    try {
      this.subClient = this.createRedisClient();
      this.pubClient = this.createRedisClient();
      this.handleError(this.pubClient);
      this.handleError(this.subClient);
      this.start(callback);
    } catch (err) {
      callback(err);
    }
  }
  start(callback) {
    Promise.all([this.subClient.connect(), this.pubClient.connect()])
      .then(() => {
        this.bindEvents(this.subClient, this.pubClient);
        callback();
      })
      .catch(callback);
  }
  bindEvents(subClient, pubClient) {
    subClient.on(
      this.options?.wildcards ? 'pmessage' : constants.MESSAGE_EVENT,
      this.getMessageHandler(pubClient).bind(this),
    );
    const subscribePatterns = [...this.messageHandlers.keys()];
    subscribePatterns.forEach((pattern) => {
      const { isEventHandler } = this.messageHandlers.get(pattern);
      const channel = isEventHandler
        ? pattern
        : this.getRequestPattern(pattern);
      if (this.options?.wildcards) {
        subClient.psubscribe(channel);
      } else {
        subClient.subscribe(channel);
      }
    });
  }
  close() {
    this.isExplicitlyTerminated = true;
    this.pubClient && this.pubClient.quit();
    this.subClient && this.subClient.quit();
  }
  createRedisClient() {
    return new redisPackage({
      port: constants.REDIS_DEFAULT_PORT,
      host: constants.REDIS_DEFAULT_HOST,
      ...this.getClientOptions(),
      lazyConnect: true,
    });
  }
  getMessageHandler(pub) {
    return this.options?.wildcards
      ? (channel, pattern, buffer) =>
          this.handleMessage(channel, buffer, pub, pattern)
      : (channel, buffer) => this.handleMessage(channel, buffer, pub, channel);
  }
  async handleMessage(channel, buffer, pub, pattern) {
    const rawMessage = this.parseMessage(buffer);
    const packet = await this.deserializer.deserialize(rawMessage, { channel });
    const redisCtx = new RedisContext([pattern]);
    if ((0, utils.isUndefined)(packet.id)) {
      return this.handleEvent(channel, packet, this.ws);
    }
    const publish = this.getPublisher(pub, channel, packet.id);
    const handler = this.getHandlerByPattern(channel);
    if (!handler) {
      const status = 'error';
      const noHandlerPacket = {
        id: packet.id,
        status,
        err: constants.NO_MESSAGE_HANDLER,
      };
      return publish(noHandlerPacket);
    }

    const response$ = this.transformToObservable(
      await handler(packet.data, this.ws),
    );
    response$ && this.send(response$, publish);
  }
  getPublisher(pub, pattern, id) {
    return (response) => {
      Object.assign(response, { id });
      const outgoingResponse = this.serializer.serialize(response);
      return pub.publish(
        this.getReplyPattern(pattern),
        JSON.stringify(outgoingResponse),
      );
    };
  }
  parseMessage(content) {
    try {
      return JSON.parse(content);
    } catch (e) {
      return content;
    }
  }
  getRequestPattern(pattern) {
    return pattern;
  }
  getReplyPattern(pattern) {
    return `${pattern}.reply`;
  }
  handleError(stream) {
    stream.on(constants.ERROR_EVENT, (err) => this.logger.error(err));
  }
  getClientOptions() {
    const retryStrategy = (times) => this.createRetryStrategy(times);
    return {
      ...(this.options || {}),
      retryStrategy,
    };
  }
  createRetryStrategy(times) {
    if (this.isExplicitlyTerminated) {
      return undefined;
    }
    if (
      !this.getOptionsProp(this.options, 'retryAttempts') ||
      times > this.getOptionsProp(this.options, 'retryAttempts')
    ) {
      this.logger.error(`Retry time exhausted`);
      return;
    }
    return this.getOptionsProp(this.options, 'retryDelay') || 0;
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const ms = await NestFactory.createMicroservice(AppModule, {
    strategy: new Rds(
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
