import { LoginType } from './auth.constants';

export interface JwtPayload {
  id: number;
  type: LoginType;
}
