import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { InvoiceTypes, PaymentMethods } from '../enums';
import { ContactsRoles } from 'src/auth/enums';
import { Contributors } from '../enums/contributors.enum';

export type ContactDocument = Contact & mongoose.Document;

@Schema({ _id: false })
class Dni {
  @Prop({ type: String, required: true })
  type: string; // tipo de documento de identidad

  @Prop({ type: String, required: true })
  number: string; // caracteres alfanuméricos del documento
}

@Schema({ _id: false })
class PaymentMethod {
  @Prop({ type: String, required: false, default: PaymentMethods.CASH })
  type: string; // crédito, débito, efectivo, en cuótas o parcial

  @Prop({ type: Number, required: false, default: null })
  time: string; // plazo de pago opcional solo para cuótas, plazo en cantidad de cuótas
}

@Schema({ _id: false })
class InvoiceType {
  // @Prop({ type: String, required: false, default: InvoiceTypes.PAID })
  // type: string; // enum: por pagar | por cobrar | pagada | cancelada

  @Prop([{ type: String, required: false, default: null }]) // remplazar por objectsId
  awaitingPayment: string[]; // arreglo de facturas por pagar

  @Prop([{ type: String, required: false, default: null }]) // remplazar por objectsId
  awaitingRetrieval: string[]; // arreglo de facturas por cobrar

  @Prop([{ type: String, required: false, default: null }]) // remplazar por objectsId
  paid: string[]; // arreglo de facturas pagadas

  @Prop([{ type: String, required: false, default: null }]) // remplazar por objectsId
  cancelled: string[]; // arreglo de facturas canceladas
}

@Schema({ timestamps: true })
export class Contact {
  @Prop({ type: String, required: true })
  name: string; // nombre del cliente o proveedor

  @Prop({ type: String, required: false, default: null })
  surname: string;

  @Prop({ type: Dni, required: true })
  dni: Dni;

  @Prop({ type: String, required: false, default: null })
  email: string;

  @Prop({ type: String, required: false, default: null })
  primaryPhone: string;

  @Prop({ type: String, required: false, default: null })
  secondaryPhone: string;

  @Prop({ type: String, required: false, default: null })
  mobilePhone: string;

  @Prop({ type: String, required: false, default: null })
  fax: string;

  @Prop({ type: String, required: false, default: null })
  details: string; // observaciones sobre el cliente | proveedor

  // @Prop()
  // seller: string; // objectId del vendedor que atendió el requerimiento

  // @Prop()
  // paymentMethod: PaymentMethod;

  @Prop({ type: String, required: false, default: null })
  address: string;

  @Prop([{ type: String, required: false, default: ContactsRoles.Customer }])
  type: string[]; // enum: cliente | proveedor;

  @Prop({ type: String, required: false, default: null })
  referredBy: string; // id del enlace de esta persona u objeto con datos de quien refiere a esta persona

  @Prop({ type: String, required: false, default: Contributors.NONE })
  representation: string; // contribuyente formal, especial, ninguno

  // @Prop()
  // operationType: string; // tipo de operación que realiza

  // @Prop()
  // invoice: InvoiceType; // por pagar, por cobrar

  @Prop({ type: Boolean, required: false, default: false })
  status: boolean;
}

export const ContactSchema = SchemaFactory.createForClass(Contact);
