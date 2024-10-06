import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { CreateProjectCommand } from '../commands/create-project.command';
import { ProjectMemberModel, Project, ProjectModel } from '@geveze/db';

@CommandHandler(CreateProjectCommand)
export class CreateProjectHandler
  implements ICommandHandler<CreateProjectCommand>
{
  constructor(private jwtService: JwtService) {}

  async execute(
    command: CreateProjectCommand,
  ): Promise<{ project: Project; token: string }> {
    const project = await ProjectModel.create(command);

    await ProjectMemberModel.create({
      project: project._id,
      user: command.user._id,
    });

    const token = await this.jwtService.signAsync({
      _id: command.user._id,
      email: command.user.email,
      project: project._id,
    });

    return { project: project.toJSON(), token };
  }
}
