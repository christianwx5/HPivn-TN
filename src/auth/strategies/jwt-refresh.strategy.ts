import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

import { AppConfigService } from 'src/config/app/configuration.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    readonly appConfigService: AppConfigService,
    private userService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: appConfigService.jwtRefreshSecret,
      passReqToCallback: true,
    });
  }

  async validate(req: any, payload: any) {
    const refreshToken = req?.headers?.authorization.split('Bearer ')[1];
    const id = payload.sub;
    return await this.userService.getUserIfRefreshTokenMatches(
      refreshToken,
      id,
    );
  }
}
