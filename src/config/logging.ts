import { registerAs } from '@nestjs/config';
import { join } from 'path';

export interface ConfigLogging {
  path: string;
  level: string;
}

export default registerAs(
  'logging',
  (): ConfigLogging => ({
    path: `${join(__dirname, '../')}/storage/logs`,
    level: process.env.LOG_LEVEL || 'debug',
  }),
);
