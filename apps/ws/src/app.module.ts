import { Module } from '@nestjs/common';
import { EventsModule } from './events/events.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import mongoose from 'mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      load: [configuration],
    }),
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => {
        return {
          secret: config.get('jwt_secret'),
          signOptions: { expiresIn: '1d' },
        };
      },
      inject: [ConfigService],
      global: true,
    }),
    EventsModule,
  ],
  controllers: [],
  providers: [
    {
      provide: 'database',
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        mongoose
          .connect(config.get('database.url'), {
            directConnection: true,
            maxPoolSize: 10000,
          })
          .then(() => console.log('connected'));
      },
    },
  ],
})
export class AppModule {}
