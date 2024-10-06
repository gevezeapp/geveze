import { UserModel } from '@geveze/db';
import { LoginCommand } from '../commands/login-command';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@CommandHandler(LoginCommand)
export class LoginHandler implements ICommandHandler<LoginCommand> {
  constructor(private jwtService: JwtService) {}

  async execute(command: LoginCommand): Promise<{ token: string }> {
    const user = await UserModel.findOne({ email: command.email });

    if (!user || !user.checkPassword(command.password))
      throw new NotFoundException();

    const token = await this.jwtService.signAsync({
      _id: user._id,
      email: user.email,
    });

    return { token };
  }
}
