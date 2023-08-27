import {config} from 'dotenv';
import {getEnvFilePath} from './utils/getEnvFilePath';
config({path: getEnvFilePath()});

import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {ProxyMiddleware} from './auth-proxy/proxy.middleware';
import {ValidationPipe} from '@nestjs/common';
import {SwaggerModule, DocumentBuilder} from '@nestjs/swagger';
import {ENV} from './common/enums/env.enum';

import * as packageJson from '../package.json';

async function bootstrap() {
  console.log('[INFO] App env is:', process.env.APP_ENV);
  const app = await NestFactory.create(AppModule);

  const proxy = app.get(ProxyMiddleware);
  const validationPipe = new ValidationPipe();

  app.use(proxy.use.bind(proxy));
  app.useGlobalPipes(validationPipe);

  if (process.env.NODE_ENV !== ENV.PRODUCTION) {
    const config = new DocumentBuilder()
      .setTitle('Email sender API')
      .setVersion(packageJson.version)
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('swagger', app, document);
  }

  await app
    .listen(process.env.APP_PORT!)
    .then(() => console.log('[INFO] Email sender service is launched'));
}

bootstrap();
