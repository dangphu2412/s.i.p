import { config } from 'dotenv';
config();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@modules/config/config.service';
import { GRAPHQL_UI_PATH } from './constants/config.constant';
import { getCorsConfig } from './configs/cors.config';

async function bootstrap() {
  const PORT = ConfigService.get('PORT');

  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors(getCorsConfig());
  app.setGlobalPrefix('/api');

  await app.listen(PORT);

  Logger.log(`Apollo server is running on ${GRAPHQL_UI_PATH}`);
  Logger.log(`Server is listening on port ${PORT}`);
  Logger.log(`Server is running on mode ${ConfigService.get('NODE_ENV')}`);
}

bootstrap();
