import { Module } from '@nestjs/common';
import { ProjectController } from './project.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateProjectHandler } from './handlers/create-project.handler';
@Module({
  imports: [CqrsModule],
  controllers: [ProjectController],
  providers: [CreateProjectHandler],
})
export class ProjectModule {}
