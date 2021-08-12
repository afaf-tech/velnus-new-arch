import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Request } from '@common/http';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): Promise<boolean> | Observable<boolean> | boolean {
    const permissions = this.reflector.get<string[]>('permissions', context.getHandler());
    const request: Request = context.switchToHttp().getRequest();

    const cek = permissions.some(permission => request.user.permissions?.includes(permission));
    if (!cek) {
      return false;
    }
    return true;
  }
}
