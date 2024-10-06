import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { SendMessageCommand } from '../commands/send-message.command';
import { ChannelModel, MessageModel, Message, ChatUserModel } from '@geveze/db';
import mongoose from 'mongoose';
import { ClientRedis } from '@nestjs/microservices';

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
    channel.members = [{ user: command.sender }, { user: user._id }];
    const message = await MessageModel.create({
      channel: channel._id,
      message: command.message,
      sender: command.sender,
    });

    const messageData = message.toJSON();

    this.client.emit('NEW_MESSAGE', {
      channel,
      message: messageData,
    });

    return messageData;
  }
}
