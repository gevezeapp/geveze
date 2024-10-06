import {
  getModelForClass,
  prop,
  pre,
  DocumentType,
} from '@typegoose/typegoose';
import * as bcrypt from 'bcryptjs';

@pre<any>('save', function () {
  this.password = bcrypt.hashSync(this.password, 8);
})
export class User {
  @prop({ required: true })
  public name: string;

  @prop({ unique: true, required: true })
  public email: string;

  @prop({ required: true })
  public password: string;

  public checkPassword(this: DocumentType<any>, password: string) {
    return bcrypt.compareSync(password, this.password);
  }
}

export const UserModel = getModelForClass(User);
