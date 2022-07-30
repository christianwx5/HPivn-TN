import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { AppAbility, CaslAbilityFactory } from '../factories';
import { PERMISSION_CHECKER_KEY, RequiredPermission } from '../decorators';

@Injectable()
export class AttributesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private abilityFactory: CaslAbilityFactory,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions =
      this.reflector.get<RequiredPermission[]>(
        PERMISSION_CHECKER_KEY,
        context.getHandler(),
      ) || [];

    const { user } = context.switchToHttp().getRequest();

    const ability = await this.abilityFactory.createForUser(user);

    return requiredPermissions.every((permission) =>
      this.isAllowed(ability, permission),
    );
  }
  isAllowed(ability: AppAbility, permission: RequiredPermission): boolean {
    return ability.can(...permission);
  }
}
