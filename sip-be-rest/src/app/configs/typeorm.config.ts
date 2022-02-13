import { ROOT_DIR } from '@constants/app.constant';
import { DynamicModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { isBooleanString } from 'class-validator';
import { ConfigService } from 'src/external/config/config.service';

export function getTypeOrmModule(): DynamicModule {
  const isNotProd: boolean = ConfigService.get('NODE_ENV') !== 'production';
  const pathLookupEntities = [`${ROOT_DIR}/**/*.entity.js`];

  return TypeOrmModule.forRoot({
    type: 'postgres',
    host: ConfigService.get('DB_HOST'),
    port: ConfigService.getInt('DB_PORT'),
    username: ConfigService.get('DB_USERNAME'),
    password: ConfigService.get('DB_PASSWORD'),
    database: ConfigService.get('DB_DATABASE'),
    entities: pathLookupEntities,
    ssl: ConfigService.getBoolean('DB_SSL')
      ? {
          rejectUnauthorized: false,
        }
      : false,
    synchronize: isBooleanString(ConfigService.getOptional('DB_SYNC'))
      ? ConfigService.getBoolean('DB_SYNC')
      : isNotProd,
    logging: !!ConfigService.getOptional('DB_LOG') || isNotProd,
  });
}
