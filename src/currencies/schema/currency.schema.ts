import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type CurrencyDocument = Currency & mongoose.Document;

@Schema({ timestamps: true })
export class Currency {
  // Company
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Company',
  })
  companyId: mongoose.ObjectId;

  //Nombre de la moneda: United States Dollar
  @Prop()
  name: string;

  //Código ISO de la moneda: USD
  @Prop()
  code: string;

  //Símbolo de la moneda: $
  @Prop()
  symbol: string;

  // Cambio actual a la moneda principal 3000.00
  @Prop()
  exchangeRate: number;

  //Estado de la moneda: active
  @Prop({ type: Boolean, required: false, default: true })
  status: boolean;

  // User id = mongoId
  @Prop({ type: mongoose.Schema.Types.ObjectId, required: false, ref: 'User' })
  createdBy: mongoose.ObjectId;
  // User id = mongoId
  @Prop({ type: mongoose.Schema.Types.ObjectId, required: false, ref: 'User' })
  updatedBy: mongoose.ObjectId;
}

export const CurrencySchema = SchemaFactory.createForClass(Currency);
