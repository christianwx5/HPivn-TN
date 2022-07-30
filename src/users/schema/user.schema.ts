import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Languages, Actions, UsersRoles, Resources } from 'src/auth/enums';

export type UserDocument = User & mongoose.Document;

@Schema({ _id: false })
class Options {
  @Prop({ type: String, required: true, default: Actions.READ })
  action: string;

  @Prop({ type: String, required: true, default: Resources.ALL })
  subject: string;

  @Prop({ type: JSON, required: false, default: null })
  conditions: JSON;
}

@Schema({ timestamps: true })
export class User {
  @Prop({ type: String, required: false, default: null })
  name: string;

  @Prop({ type: String, required: false, default: null })
  surname: string;

  @Prop({ type: String, required: true, unique: true })
  email: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ type: String, required: false, default: Languages.ES_VE })
  languages: string;

  @Prop({ type: String, required: false, default: null })
  avatar: string;

  @Prop({ type: String, required: true })
  location: string;

  @Prop({ type: String, required: true, default: UsersRoles.Admin })
  role: string;

  @Prop([{ type: Options }])
  permissions: Options[];

  @Prop({ type: Boolean, required: false, default: false })
  status: boolean;

  @Prop({ type: String, required: false, default: null })
  refreshToken: string;

  @Prop({ type: Date, required: false, default: null })
  lastLogin: Date;

  // change to array to let the user manage more than one company
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    default: null,
    ref: 'Company',
  })
  companies: mongoose.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    default: null,
    ref: 'User',
  })
  createdBy: mongoose.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    default: null,
    ref: 'User',
  })
  updatedBy: mongoose.ObjectId;
}

export const UserSchema = SchemaFactory.createForClass(User);
