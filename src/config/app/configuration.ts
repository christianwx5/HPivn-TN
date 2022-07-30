import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  name: process.env.NAME,
  host: process.env.HOST,
  port: process.env.PORT,
  jwtAccessSecret: process.env.JWT_ACCESS_TOKEN_SECRET,
  jwtAccessExpirationTime: process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME,
  jwtRefreshSecret: process.env.JWT_REFRESH_TOKEN_SECRET,
  jwtRefreshExpirationTime: process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME,
}));
