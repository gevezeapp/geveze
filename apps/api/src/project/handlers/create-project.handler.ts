import { UserModel } from 'src/models/User';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { HttpStatus, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateProjectCommand } from '../commands/create-project.command';
import { ProjectMemberModel, ProjectModel } from 'src/models/Project';

@CommandHandler(CreateProjectCommand)
export class CreateProjectHandler
  implements ICommandHandler<CreateProjectCommand>
{
  constructor(private jwtService: JwtService) {}

  async execute(command: CreateProjectCommand): Promise<any> {
    const project = await ProjectModel.create(command);

    const membership = await ProjectMemberModel.create({
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
