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

@CommandHandler(SendMessageCommand)
export class SendMessageHandler implements ICommandHandler<SendMessageCommand> {
  constructor(@Inject('WS_SERVICE') private client: ClientRedis) {}

  async execute(command: SendMessageCommand): Promise<Message> {
    const user = await ChatUserModel.findOne({
      externalId: command.toUser,
    }).lean();

    const channel = await ChannelModel.findChannel({
      project: user.project,
      key: [command.sender, user._id.toString()].sort().join('-'),
      users: [user._id, new mongoose.Types.ObjectId(command.sender)],
    });

    const message = await MessageModel.create({
      channel: channel._id,
      message: command.message,
      sender: command.sender,
    });

    await ChannelMemberModel.updateMany(
      { channel: channel._id },
      { $inc: { unread: 1 }, lastActivity: Date.now() },
    );

    await message.populate({
      path: 'sender',
      select: { id: '$externalId', _id: 0, displayName: 1, username: 1 },
    });

    const messageData = message.toJSON();

    this.client.emit('NEW_MESSAGE', {
      channel,
      message: messageData,
      to: channel.members
        .filter((member) => member.user._id.toString() !== command.sender)
        .map((member) => member.user._id.toString()),
    });

    return messageData;
  }
}
