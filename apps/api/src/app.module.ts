import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import mongoose from 'mongoose';
import { JwtModule } from '@nestjs/jwt';
import { ProjectModule } from './project/project.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { ChatModule } from './chat/chat.module';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    CacheModule.register<any>({
      isGlobal: true,
      ttl: 5000,
      max: 10,
    }),
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
    AuthModule,
    ChatModule,
    ProjectModule,
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
