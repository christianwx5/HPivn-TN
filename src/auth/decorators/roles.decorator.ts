import { SetMetadata } from '@nestjs/common';

import { UsersRoles } from '../enums';

export const ROLES_KEY = 'roles';
export const Roles = (roles: UsersRoles) => SetMetadata(ROLES_KEY, roles);
