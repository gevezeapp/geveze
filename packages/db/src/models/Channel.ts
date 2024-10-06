import {
  getModelForClass,
  prop,
  Ref,
  ReturnModelType,
} from "@typegoose/typegoose";
import { Project } from "./Project";
import { ChatUser } from "./ChatUser";
import mongoose from "mongoose";

export class ChannelMember {
  @prop({ required: true, ref: () => Channel })
  public channel: Ref<Channel>;

  @prop({ required: true, ref: () => ChatUser })
  public user: Ref<ChatUser>;

  @prop({ default: 0 })
  public unread: number;

  @prop({ default: Date.now() })
  public lastActivity: number;

  public static async listChannels(
    this: ReturnModelType<typeof ChannelMember>,
    data
  ) {
    const list = await this.aggregate([
      {
        $match: {
          user: mongoose.Types.ObjectId.createFromHexString(data.user),
          ...(data.channel && {
            channel: mongoose.Types.ObjectId.createFromHexString(data.channel),
          }),
        },
      },
      { $sort: { lastActivity: -1 } },
      { $skip: data.skip },
      {
        $limit: data.limit,
      },
      {
        $lookup: {
          from: "channels",
          localField: "channel",
          foreignField: "_id",
          let: { channelId: "$channel" },
          pipeline: [
            {
              $lookup: {
                from: "messages",
                localField: "_id",
                foreignField: "channel",
                pipeline: [
                  {
                    $lookup: {
                      from: "chatusers",
                      localField: "sender",
                      foreignField: "_id",
                      pipeline: [
                        {
                          $project: {
                            id: "$externalId",
                            _id: 0,
                          },
                        },
                      ],
                      as: "sender",
                    },
                  },
                  { $sort: { createdAt: -1 } },
                  { $limit: 1 },
                  {
                    $project: {
                      message: 1,
                      createdAt: 1,
                      updatedAt: 1,
                      sender: { $arrayElemAt: ["$sender", 0] },
                    },
                  },
                ],
                as: "lastMessage",
              },
            },
            {
              $lookup: {
                from: "channelmembers",
                localField: "_id",
                foreignField: "channel",
                pipeline: [
                  {
                    $lookup: {
                      from: "chatusers",
                      localField: "user",
                      foreignField: "_id",
                      pipeline: [
                        {
                          $project: {
                            id: "$externalId",
                            _id: 1,
                            displayName: 1,
                            isOnline: 1,
                            profilePicture: 1,
                          },
                        },
                      ],
                      as: "user",
                    },
                  },
                  { $limit: 2 },
                  { $unwind: "$user" },
                  { $project: { channel: 0, __v: 0, _id: 1 } },
                ],
                as: "members",
              },
            },
            {
              $project: {
                _id: 1,
                members: 1,
                unread: 1,
                lastMessage: {
                  $arrayElemAt: ["$lastMessage", 0],
                },
              },
            },
          ],
          as: "channel",
        },
      },
      { $unwind: "$channel" },
      {
        $replaceRoot: {
          newRoot: { $mergeObjects: [{ unread: "$unread" }, "$channel"] },
        },
      },
    ]);

    return list.map((item) => ({
      ...item,
      user: item.members.find(
        (member) => member.user._id.toString() != data.user
      ).user,
    }));
  }
}

export class Channel {
  @prop({ required: true, ref: () => Project })
  public project: Ref<Project>;

  @prop({ required: true })
  public type: string;

  @prop({ required: false })
  public key: string;

  public static async findChannel(this: ReturnModelType<typeof Channel>, data) {
    const get = await this.aggregate([
      {
        $match: {
          type: "1-1",
          project: data.project,
          key: data.key,
        },
      },
      {
        $lookup: {
          from: "channelmembers",
          localField: "_id",
          foreignField: "channel",
          as: "members",
        },
      },
    ]);

    if (get[0]) return get[0];

    const newChannel = await this.create({
      project: data.project,
      type: "1-1",
      key: data.key,
    });
    const members = await ChannelMemberModel.create([
      { channel: newChannel._id, user: data.users[0] },
      { channel: newChannel._id, user: data.users[1] },
    ]);
    return { ...newChannel.toJSON(), members };
  }
}

export const ChannelModel = getModelForClass(Channel);
export const ChannelMemberModel = getModelForClass(ChannelMember);
