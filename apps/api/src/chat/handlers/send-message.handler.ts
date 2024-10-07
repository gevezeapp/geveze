import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
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
    const channels = await ChannelMemberModel.listChannels({
      limit: 1,
      skip: 0,
      user: command.sender,
      channel: command.channel,
    });

    if (!channels[0]) throw new NotFoundException('Channel not found!');

    const channel = channels[0];

    const message = await MessageModel.create({
      channel: channel._id,
      message: command.message,
      sender: command.sender,
    });

    await ChannelMemberModel.updateMany(
      { channel: channel._id, user: { $ne: command.sender } },
      {
        $inc: { unread: 1 },
        $set: { lastActivity: Date.now() },
      },
    );

    await ChannelMemberModel.updateOne(
      { channel: channel._id, user: command.sender },
      { $set: { lastActivity: Date.now() } },
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
