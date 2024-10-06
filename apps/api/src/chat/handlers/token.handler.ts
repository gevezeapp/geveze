import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { ChatUserModel, ProjectModel } from '@geveze/db';
import { TokenCommand } from '../commands/token.command';
import { NotFoundException } from '@nestjs/common';

@CommandHandler(TokenCommand)
export class TokenHandler implements ICommandHandler<TokenCommand> {
  constructor(private jwtService: JwtService) {}

  async execute(command: TokenCommand): Promise<{ token: string }> {
    const project = await ProjectModel.findOne({ key: command.project });

    if (!project) throw new NotFoundException('Project not found!');

    let chatUser = await ChatUserModel.findOne({
      project: project._id,
      externalId: command.id,
    });

    if (!chatUser)
      chatUser = await ChatUserModel.create({
        externalId: command.id,
        project: project._id,
      });

    const token = await this.jwtService.signAsync({
      _id: chatUser.id,
      project: project.key,
      aud: 'chat',
    });

    return { token };
  }
}
