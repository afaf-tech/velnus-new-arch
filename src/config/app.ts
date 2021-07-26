import { stringToBoolean } from '@common/utils';
import { registerAs } from '@nestjs/config';

export interface ConfigApp {
  name: string;
  env: string;
  debug: boolean;
  url: string;
  port: number;
  secretKey: string;
}

export default registerAs(
  'app',
  (): ConfigApp => ({
    name: process.env.APP_NAME || 'VelnusApp',
    env: process.env.APP_ENV || 'local',
    debug: stringToBoolean(process.env.APP_DEBUG),
    url: process.env.APP_URL || 'localhost',
    port: +process.env.APP_PORT || 5000,
    secretKey: process.env.APP_SECRET_KEY,
  }),
);
