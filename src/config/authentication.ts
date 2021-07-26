import { registerAs } from '@nestjs/config';

export interface ConfigAuthentication {
  jwt_expiration: string;
}

export default registerAs(
  'authentication',
  (): ConfigAuthentication => ({
    jwt_expiration: '30d',
  }),
);
