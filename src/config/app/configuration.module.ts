import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';

import configuration from './configuration';
import { AppConfigService } from './configuration.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
  ],
  providers: [ConfigService, AppConfigService],
  exports: [ConfigService, AppConfigService],
})
export class AppConfigModule {}
