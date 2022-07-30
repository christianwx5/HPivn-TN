import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private readonly configService: ConfigService) {}

  get name(): string {
    return this.configService.get<string>('app.name');
  }

  get host(): string {
    return this.configService.get<string>('app.host');
  }

  get port(): number {
    return this.configService.get<number>('app.port');
  }

  get jwtAccessSecret(): string {
    return this.configService.get<string>('app.jwtAccessSecret');
  }

  get jwtAccessExpirationTime(): string {
    return this.configService.get<string>('app.jwtAccessExpirationTime');
  }

  get jwtRefreshSecret(): string {
    return this.configService.get<string>('app.jwtRefreshSecret');
  }

  get jwtRefreshExpirationTime(): string {
    return this.configService.get<string>('app.jwtRefreshExpirationTime');
  }
}
