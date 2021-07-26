import type { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { registerAs } from '@nestjs/config';
import { join } from 'path';

export default registerAs(
  'db',
  (): TypeOrmModuleOptions => ({
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    type: (process.env.DB_TYPE as any) || 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: +process.env.DB_PORT || 3306,
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'secret',
    database: process.env.DB_DATABASE || 'velnus',
    entities: [`${join(__dirname, '../')}**/*.entity{.ts,.js}`], // to dist/**/*.entity{.ts,.js}
    migrations: [`${join(__dirname, '../')}/src/database/migrations/*{.ts,js}`],
    cli: { migrationsDir: 'src/database/migrations' },
    synchronize: false,
    logging: true,
  }),
);
