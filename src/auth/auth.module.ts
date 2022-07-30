import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AppConfigModule } from 'src/config/app/configuration.module';
import { AppConfigService } from 'src/config/app/configuration.service';
import { UsersModule } from 'src/users/users.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import {
  JwtRefreshTokenStrategy,
  JwtStrategy,
  LocalStrategy,
} from './strategies';
import { CaslAbilityFactory } from './factories/casl-ability.factory';

@Global()
@Module({
  imports: [
    UsersModule,
    PassportModule,
    AppConfigModule,
    JwtModule.registerAsync({
      imports: [AppConfigModule],
      useFactory: async (appConfigService: AppConfigService) => ({
        secret: appConfigService.jwtAccessSecret,
        signOptions: {
          expiresIn: appConfigService.jwtAccessExpirationTime,
        },
      }),
      inject: [AppConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    CaslAbilityFactory,
    LocalStrategy,
    JwtStrategy,
    JwtRefreshTokenStrategy,
  ],
  exports: [JwtModule, CaslAbilityFactory],
})
export class AuthModule {}
