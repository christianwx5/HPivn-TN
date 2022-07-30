import { Request } from 'express';
import { ObjectId } from 'mongoose';

export interface IAuthRequest extends Request {
  user: {
    _id: ObjectId;
    userId?: ObjectId;
    status: boolean;
    permissions: Array<Record<string, unknown>>;
    role: string;
    location: string;
    avatar: string;
    languages: string;
    email: string;
    surname: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    refreshToken?: string;
    companies?: ObjectId; // refactor and change to array of objectIds
  };
}
