import { ConfigService } from '@modules/config/config.service';
import { DynamicModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

export function getTypeOrmModule(): DynamicModule {
  const isDev: boolean = ConfigService.get('NODE_ENV') !== 'production';
  const pathLookupEntities = [`${process.cwd()}/**/*.entity.js`];

  return TypeOrmModule.forRoot({
    type: 'postgres',
    host: ConfigService.get('DB_HOST'),
    port: ConfigService.getInt('DB_PORT'),
    username: ConfigService.get('DB_USERNAME'),
    password: ConfigService.get('DB_PASSWORD'),
    database: ConfigService.get('DB_DATABASE'),
    entities: pathLookupEntities,
    synchronize: isDev,
    logging: isDev,
  });
}
