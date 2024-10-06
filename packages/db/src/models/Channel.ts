import {
  getModelForClass,
  prop,
  Ref,
  ReturnModelType,
} from "@typegoose/typegoose";
import { Project } from "./Project";
import { ChatUser } from "./ChatUser";

export class ChannelMember {
  @prop({ required: true, ref: () => Channel })
  public channel: Ref<Channel>;

  @prop({ required: true, ref: () => ChatUser })
  public user: Ref<ChatUser>;
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
