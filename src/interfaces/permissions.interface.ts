import { ObjectId } from 'mongoose';
import { Actions, ContactsRoles, UsersRoles } from 'src/auth/enums';

export interface IPermissions {
  action: Actions;
  subject: string;
  conditions?: Record<string, unknown>;
}

export interface IConditions {
  _id?: ObjectId;
  contactId?: ObjectId;
  productId?: ObjectId;
  role?: UsersRoles | ContactsRoles;
  email?: string;
}
