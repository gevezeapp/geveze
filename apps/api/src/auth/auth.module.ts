import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { LoginHandler } from './handlers/login.handler';
import { RegisterHandler } from './handlers/register.handler';
@Module({
  imports: [CqrsModule],
  controllers: [AuthController],
  providers: [LoginHandler, RegisterHandler],
})
export class AuthModule {}
