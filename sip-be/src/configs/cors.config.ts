import { ConfigService } from '@modules/config/config.service';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

export function getCorsConfig(): CorsOptions {
  const allowOrigins: string[] = ConfigService.get('CORS').split(',');

  return {
    origin: allowOrigins,
  };
}
