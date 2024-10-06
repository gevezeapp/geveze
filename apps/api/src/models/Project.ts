import { getModelForClass, prop, pre, Ref } from '@typegoose/typegoose';
import { User } from './User';
import * as randomstring from 'randomstring';

class ProjectMember {
  @prop({ ref: () => Project })
  public project: Ref<Project>;

  @prop({ ref: () => User })
  public user: Ref<User>;

  @prop({ default: 'owner' })
  public role: string;
}

@pre<any>('save', function () {
  this.key = randomstring.generate(10);
  this.secret = randomstring.generate();
})
export class Project {
  @prop({ required: true })
  public name: string;

  @prop({ unique: true })
  public key: string;

  @prop({ unique: true })
  public secret: string;
}

export const ProjectMemberModel = getModelForClass(ProjectMember);
export const ProjectModel = getModelForClass(Project);
