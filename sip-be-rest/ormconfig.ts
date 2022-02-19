import { ConfigService } from '@external/config/config.service';

export = [
  {
    name: 'default',
    type: 'postgres',
    username: ConfigService.get('DB_USERNAME'),
    host: ConfigService.get('DB_HOST'),
    password: ConfigService.get('DB_PASSWORD'),
    port: ConfigService.getInt('DB_PORT'),
    database: ConfigService.get('DB_DATABASE'),
    entities: ['src/**/*.entity{.ts,.js}'],
    migrations: ['src/app/database/migrations/*.ts'],
    factories: ['src/app/database/factories/**/*.factory{.ts,.js}'],
    seeds: [`src/app/database/seeds/**/*.seed{.ts,.js}`],
    ssl: ConfigService.getBoolean('DB_SSL')
      ? {
          rejectUnauthorized: false,
        }
      : false,
    cli: {
      migrationsDir: 'src/app/database/migrations',
      subscribersDir: 'src/**/*.subscriber.{.ts,.js}',
    },
  },
];
