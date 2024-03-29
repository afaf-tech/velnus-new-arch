import type { AuthCredential } from '@schemas';
import type { Request as BaseRequest } from 'express';

export interface Request extends BaseRequest {
  /**
   * Get all inputs from the request object
   */
  all(): Record<string, any>;

  /**
   * Get the current user from the request object
   */
  user: AuthCredential;
}
