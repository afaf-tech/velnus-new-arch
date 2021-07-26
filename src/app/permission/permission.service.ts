/* eslint-disable no-underscore-dangle */

import { Injectable } from '@nestjs/common';
import { Permission } from './permission.interface';
import { permissions } from './permission.constants';

@Injectable()
export class PermissionService {
  permissions: Permission[];

  constructor() {
    this.permissions = permissions;
  }

  get(id: string): Permission | undefined {
    return this.permissions.find(item => item.id === id);
  }

  has(id: string): boolean {
    return this.permissions.some(item => item.id === id);
  }

  /**
   * Alternative for `permissionService.permisisons`
   */
  all(): Permission[] {
    return this.permissions;
  }
}
