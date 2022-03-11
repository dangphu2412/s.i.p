import { getCorsConfig } from '@config/cors.config';
import { configSwagger } from '@config/swagger.config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { ConfigService } from '@external/config/config.service';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const PORT = ConfigService.getInt('PORT') ?? 3000;
  app.use(helmet());
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors(getCorsConfig());

  configSwagger(app, 'docs');

  await app.listen(PORT);

  Logger.log(
    `Server is in ${ConfigService.get('NODE_ENV')} mode`,
    'NestApplication',
  );
  Logger.log(`Server is listening on ${PORT}`, 'NestApplication');
}

bootstrap();
