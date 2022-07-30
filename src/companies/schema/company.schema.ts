import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type CompanyDocument = Company & mongoose.Document;

@Schema({ _id: false })
class Currency {
  @Prop()
  code: string;

  @Prop()
  symbol: string;

  @Prop()
  exchangeRate: number;
}

@Schema({ _id: false })
class Address {
  @Prop()
  province: string;

  @Prop()
  city: string;

  @Prop()
  zipCode: string;

  @Prop()
  address: string;
}

@Schema({ _id: false })
class InvoicePreferences {
  @Prop()
  defaultAnnotation: string;

  @Prop()
  defaultTermsAndConditions: string;
}

@Schema({ _id: false })
class LegalRepresentative {
  @Prop()
  firstname: string;

  @Prop()
  lastname: string;

  @Prop()
  email: string;

  @Prop()
  phone: string;
}

@Schema({ timestamps: true })
export class Company {
  @Prop()
  name?: string;

  @Prop()
  identification: string;

  @Prop()
  phone: string;

  @Prop()
  fax?: string;

  @Prop()
  website?: string;

  @Prop()
  email: string;

  @Prop()
  regime: string;

  @Prop()
  currency: Currency;

  @Prop()
  multiCurrency: boolean;

  @Prop()
  decimalPrecision: number;

  @Prop()
  address: Address;

  @Prop()
  invoicePreferences: InvoicePreferences;

  @Prop()
  initialInvoiceNumber: string;

  @Prop()
  planType: string;

  @Prop()
  legalRepresentative: LegalRepresentative;

  @Prop()
  isOpen: boolean;

  @Prop()
  workingTime: string;

  @Prop()
  specialWorkingTime: string;

  @Prop()
  logo: string;

  @Prop()
  slogan: string;

  @Prop()
  description: string;

  @Prop()
  applicationVersion: string;

  @Prop()
  timezone: string;

  @Prop({ default: true })
  status: boolean;

  @Prop({ type: mongoose.Schema.Types.ObjectId, required: false, ref: 'User' })
  createdBy: mongoose.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, required: false, ref: 'User' })
  updatedBy: mongoose.ObjectId;
}

export const CompanySchema = SchemaFactory.createForClass(Company);
