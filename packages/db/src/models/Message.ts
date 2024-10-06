import { getModelForClass, prop, Ref } from "@typegoose/typegoose";
import { Channel } from "./Channel";
import { ChatUser } from "./ChatUser";
import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";

export class Message extends TimeStamps {
  @prop({ required: false, ref: () => Channel })
  public channel: Ref<Channel>;

  @prop({ required: true, ref: () => ChatUser })
  public sender: Ref<ChatUser>;

  @prop({ required: true })
  public message: string;
}

export const MessageModel = getModelForClass(Message);
