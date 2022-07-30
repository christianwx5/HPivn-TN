import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type CategoryDocument = Category & mongoose.Document;

@Schema({ timestamps: true })
export class Category {

  @Prop({
    type: String,
    required: true,
  })
  name: string;

  @Prop({
    type: String,
    required: true,
  })
  description: string;

  @Prop({
    type: Boolean,
    required: true,
    default: true,
  })
  status: boolean;

  @Prop({
    type: String,
    required: false,
  })
  slug: string;

  @Prop({ 
    type: mongoose.Schema.Types.ObjectId, 
    required: true, ref: 'category',
    default: null,
  })
  createdBy: mongoose.ObjectId;

  @Prop({ 
    type: mongoose.Schema.Types.ObjectId, 
    required: true, ref: 'category',
    default: null,
  })
  updatedBy: mongoose.ObjectId;

}

export const CategorySchema = SchemaFactory.createForClass(Category);
