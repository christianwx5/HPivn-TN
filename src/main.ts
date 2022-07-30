import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VersioningType, ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import * as compression from 'compression';

async function bootstrap() {
  /*
   * Logger can shown the above logs types:
   * ['error', 'warn', 'debug', 'log', 'verbose' ]
   */
  const app = await NestFactory.create(AppModule, {
    logger: ['warn', 'error', 'debug'],
    cors: true,
  });
  const configService = app.get(ConfigService);
  const port = configService.get('PORT');
  const logger = new Logger();

  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.use(helmet());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  app.use(compression());

  await app.listen(port || 3000);
  logger.debug(`🚀 API launched on: ${await app.getUrl()}`);

  require('dns').lookup(require('os').hostname(), function (err, add, fam) { 
    console.log('You server is runing on: http://localhost:'+port+'/api/ and on red: http://'+add+':'+port+'/api/');
  });
}
bootstrap();
