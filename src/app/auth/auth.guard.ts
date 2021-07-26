/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable class-methods-use-this */

import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from '@common/http';
import { AuthGuard as BaseAuthGuard } from '@nestjs/passport';
import { AuthCredential } from '@schemas';

@Injectable()
export class AuthGuard extends BaseAuthGuard('jwt') {
  handleRequest<T extends AuthCredential>(
    err: any,
    user: T,
    _info: any,
    context: ExecutionContext,
    _status: any,
  ): T {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }

    const request: Request = context.switchToHttp().getRequest();
    if (request.headers.authorization) {
      const { authorization } = request.headers;
      user.accessToken = authorization.replace('Bearer ', '');
    }

    return user;
  }
}
