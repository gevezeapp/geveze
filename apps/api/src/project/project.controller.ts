import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { CreateProjectDto } from './dtos/createProject.dto';
import { CommandBus } from '@nestjs/cqrs';
import { CreateProjectCommand } from './commands/create-project.command';

@UseGuards(AuthGuard)
@Controller('projects')
export class ProjectController {
  constructor(private commandBus: CommandBus) {}

  @Post('')
  async createProject(@Body() body: CreateProjectDto, @Request() req) {
    return this.commandBus.execute(
      new CreateProjectCommand(body.name, req.user),
    );
  }
}
