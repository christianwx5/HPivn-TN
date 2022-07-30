import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { PriceType } from '../enums';

export type PriceDocument = Price & mongoose.Document;

@Schema({ timestamps: true })
export class Price {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true, default: PriceType.PLAIN })
  classification: string;

  @Prop({ type: Number, required: false })
  percentage: number;

  @Prop({ type: Boolean, required: false, default: false })
  status: boolean;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Company',
  })
  companyId: mongoose.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, required: false, ref: 'User' })
  createdBy: mongoose.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, required: false, ref: 'User' })
  updatedBy: mongoose.ObjectId;
}

export const PriceSchema = SchemaFactory.createForClass(Price);
