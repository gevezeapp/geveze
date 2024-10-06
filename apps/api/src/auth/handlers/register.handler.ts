import { UserModel } from 'src/models/User';
import { LoginCommand } from '../commands/login-command';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { RegisterCommand } from '../commands/register-command';
import { BadRequestException } from '@nestjs/common';

@CommandHandler(RegisterCommand)
export class RegisterHandler implements ICommandHandler<RegisterCommand> {
  constructor(private jwtService: JwtService) {}

  async execute(command: LoginCommand): Promise<any> {
    try {
      const user = await UserModel.create(command);

      const token = await this.jwtService.signAsync({
        _id: user._id,
        email: user.email,
      });

      return { token };
    } catch (error) {
      if (error.code == 11000)
        throw new BadRequestException('Email is already exist');
    }
  }
}
