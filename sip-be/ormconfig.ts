import { ConfigService } from '@modules/config/config.service';

export = [
  {
    type: 'postgres',
    host: ConfigService.get('DB_HOST'),
    port: +ConfigService.get('DB_PORT'),
    username: ConfigService.get('DB_USERNAME'),
    password: ConfigService.get('DB_PASSWORD'),
    database: ConfigService.get('DB_DATABASE'),
    migrations: ['src/database/migrations/*.ts'],
    entities: ['src/**/*.entity{.ts,.js}'],
    factories: ['src/database/factories/**/*.factory{.ts,.js}'],
    seeds: [`src/database/seedings/**/*.seed{.ts,.js}`],
    cli: {
      migrationsDir: 'src/database/migrations',
    },
  },
];
