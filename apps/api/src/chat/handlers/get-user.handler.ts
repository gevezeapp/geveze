import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import {
  ChannelMember,
  ChannelMemberModel,
  ChannelModel,
  ChatUser,
  ChatUserModel,
} from '@geveze/db';
import mongoose from 'mongoose';
import { GetChannelQuery } from '../queries/get-channel.query';
import { Channel } from 'diagnostics_channel';
import { NotFoundException } from '@nestjs/common';
import { GetUserQuery } from '../queries/get-user.query';

@QueryHandler(GetUserQuery)
export class GetUserHandler implements IQueryHandler<GetUserQuery> {
  async execute(query: GetUserQuery): Promise<ChatUser> {
    const user = await ChatUserModel.findOne({
      project: query.project,
      externalId: query.user,
    });

    return user;
  }
}
