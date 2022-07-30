import { ObjectId } from 'mongoose';

export interface IPaginationOptions {
  page?: number;
  skip?: number;
  limit: number;
  sort: {
    _id: number;
  };
}

export interface IPaginationQuery {
  role?: string;
  location?: string;
  email?: string;
  name?: string | RegExp;
  surname?: string | RegExp;
  languages?: string;
  dniNumber?: string;
  itemCod?: string;
  invoiceCod?: string;
  identification?: string;
  companyId?: ObjectId;
}
