import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { SendMessageCommand } from '../commands/send-message.command';
import {
  ChannelModel,
  MessageModel,
  Message,
  ChatUserModel,
  ChannelMemberModel,
} from '@geveze/db';
import mongoose from 'mongoose';
import { ClientRedis } from '@nestjs/microservices';
import { query } from 'express';
import { CreateChannelCommand } from '../commands/create-channel.command';

@CommandHandler(CreateChannelCommand)
export class CreateChannelHandler
  implements ICommandHandler<CreateChannelCommand>
{
  async execute(command: CreateChannelCommand): Promise<Message> {
    const user = await ChatUserModel.findOne({
      externalId: command.user,
    }).lean();

    const channel = await ChannelModel.findChannel({
      project: user.project,
      key: [command.sender, user._id.toString()].sort().join('-'),
      users: [user._id, new mongoose.Types.ObjectId(command.sender)],
    });

    return channel;
  }
}
