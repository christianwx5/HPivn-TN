import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type ProductDocument = Product & mongoose.Document;

@Schema({ timestamps: true })
export class Product {
  @Prop({ type: String, required: false })
  imgURL?: string; // URL de la imágen del producto

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true, unique: true })
  cod: string;

  @Prop({ type: String, required: true })
  description: string;

  @Prop({ type: Number, required: true })
  price: number;

  @Prop({ type: Boolean, required: true, default: true })
  status: boolean;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
