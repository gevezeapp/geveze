import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { ChatUserModel, ProjectModel } from '@geveze/db';
import { TokenCommand } from '../commands/token.command';
import * as Joi from 'Joi';
import { BadRequestException, NotFoundException } from '@nestjs/common';

@CommandHandler(TokenCommand)
export class TokenHandler implements ICommandHandler<TokenCommand> {
  constructor(private jwtService: JwtService) {}

  async execute(command: TokenCommand): Promise<{ token: string }> {
    const project = await ProjectModel.findOne({ key: command.project });

    if (!project) throw new NotFoundException('Project not found!');

    try {
      const verified = await this.jwtService.verifyAsync(command.token, {
        secret: project.secret,
      });

      const { value, error } = await Joi.object({
        id: Joi.string().required().messages({
          'string.base': `token id field should be a string`,
          'string.empty': `token id field can't be empty`,
          'any.required': `token should have id field`,
        }),
        displayName: Joi.string().required().messages({
          'string.base': `token displayName field should be a string`,
          'string.empty': `token displayName field can't be empty`,
          'any.required': `token should have displayName field`,
        }),
        profilePicture: Joi.string().uri().messages({
          'string.base': `token profilePicture field should be a string`,
          'string.empty': `token profilePicture field can't be empty`,
          'string.uri': `token profilePicture field should be a uri`,
          'any.required': `token should have profilePicture field`,
        }),
        username: Joi.string().messages({
          'string.base': `token displayName field should be a string`,
          'string.empty': `token displayName field can't be empty`,
        }),
      }).validate(verified, {
        abortEarly: false,
        allowUnknown: true,
        stripUnknown: true,
      });

      if (error) throw new BadRequestException(error);

      const chatUser = await ChatUserModel.findOneAndUpdate(
        {
          project: project._id,
          externalId: value.id,
        },
        {
          displayName: value.displayName,
          profilePicture: value.profilePicture,
          username: value.username,
        },
        { upsert: true, new: true },
      );

      const token = await this.jwtService.signAsync({
        _id: chatUser.id,
        id: chatUser.externalId,
        project: project.key,
        aud: 'chat',
      });

      return { token };
    } catch (error) {
      throw new BadRequestException(
        error.cause?.details?.map((detail) => detail.message) ||
          'Invalid credentials',
      );
    }
  }
}
