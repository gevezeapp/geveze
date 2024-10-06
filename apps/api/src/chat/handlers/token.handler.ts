import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { ChatUserModel } from 'src/models/ChatUser';
import { TokenCommand } from '../commands/token.command';
import { ProjectModel } from 'src/models/Project';

@CommandHandler(TokenCommand)
export class TokenHandler implements ICommandHandler<TokenCommand> {
  constructor(private jwtService: JwtService) {}

  async execute(command: TokenCommand): Promise<any> {
    try {
      const project = await ProjectModel.findOne({ key: command.project });

      if (!project) return {};

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
    } catch (error) {
      console.log(error);
      return {};
    }
  }
}
