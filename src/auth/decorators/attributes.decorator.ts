import { CustomDecorator, SetMetadata } from '@nestjs/common';

import { Actions } from 'src/auth/enums';
import { Subjects } from '../factories';

export type RequiredPermission = [Actions, Subjects];
export const PERMISSION_CHECKER_KEY = 'permission_checker_params_key';
export const CheckPermissions = (
  ...params: RequiredPermission[]
): CustomDecorator<string> => SetMetadata(PERMISSION_CHECKER_KEY, params);
