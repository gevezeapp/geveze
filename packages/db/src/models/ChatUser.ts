import { getModelForClass, prop, Ref } from "@typegoose/typegoose";
import { Project } from "./Project";

export class ChatUser {
  @prop({ required: true })
  public externalId: string;

  @prop()
  public displayName?: string;

  @prop()
  public username?: string;

  @prop()
  public profilePicture?: string;

  @prop({ default: false })
  public isOnline?: boolean;

  @prop({ required: true, ref: () => Project })
  public project: Ref<Project>;
}

export const ChatUserModel = getModelForClass(ChatUser);
