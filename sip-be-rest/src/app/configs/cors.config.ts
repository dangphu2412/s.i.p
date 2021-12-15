import { ConfigService } from '@external/config/config.service';
import { Logger } from '@nestjs/common';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

export function getCorsConfig(): CorsOptions {
  const allowOrigins: string[] | string = ConfigService.getOptional('CORS')
    ? ConfigService.getOptional('CORS').split(',')
    : '*';
  Logger.log(`Allow origins: ${allowOrigins.toString()}`, 'NestApplication');
  return {
    allowedHeaders: allowOrigins,
  };
}
