import { ObjectId } from 'mongoose';

export interface ITokenPayload {
  email: string;
  sub: ObjectId;
  role: string;
  companies: ObjectId; // refactor and change to array of objectIds
}
