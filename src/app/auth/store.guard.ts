import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from '@common/http';
import { LoginType } from './auth.constants';

@Injectable()
export class StoreGuard implements CanActivate {
  canActivate(context: ExecutionContext): Promise<boolean> | Observable<boolean> | boolean {
    const request: Request = context.switchToHttp().getRequest();
    console.log(request);
    if (request.user.type !== LoginType.STAFF) {
      return false;
    }
    if (Number(request.params.storeId) !== request.user.account.storeId) {
      return false;
    }
    return true;
  }
}
