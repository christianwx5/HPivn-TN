import { Ability } from '@casl/ability';
import { Injectable } from '@nestjs/common';

import { IPermissions } from 'src/interfaces';
import { IAuthRequest } from 'src/interfaces/auth-request.interface';
import { AuthService } from '../auth.service';
import { Actions } from '../enums';

// export type Subjects =
//   | InferSubjects<typeof CreateUserDTO | typeof CreateProductDTO | any>
//   | 'all';
export type Subjects = any;

export type AppAbility = Ability<[Actions, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  constructor(private readonly authService: AuthService) {}

  async createForUser(user: IAuthRequest): Promise<AppAbility> {
    const { permissions }: any = await this.authService.getAllPermissionsOfUser(
      user,
    );

    // [{ action: 'C'|'R'|'U'|'D', subject: resource, conditions: { mongoQuery } | null }]
    const attributes: IPermissions[] = permissions.map((p: IPermissions) => ({
      action: p.action,
      subject: p.subject,
      conditions: p.conditions,
    }));

    return new Ability<[Actions, Subjects]>(attributes);
  }
}
