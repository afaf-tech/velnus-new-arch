/* eslint-disable no-console */

import { AdminService } from '@app/admin/admin.service';
import { StaffRoleService } from '@app/staff-role/staff-role.service';
import { StaffService } from '@app/staff/staff.service';
import { StoreService } from '@app/store/store.service';
import { Injectable } from '@nestjs/common';
import {
  setupAdminList,
  setupStaffList,
  setupStoreList,
  setupStoreRoleList,
} from './setup.constants';

@Injectable()
export class SetupService {
  constructor(
    private readonly staffService: StaffService,
    private readonly adminService: AdminService,
    private readonly storeService: StoreService,
    private readonly staffRolesService: StaffRoleService,
  ) {}

  async init(): Promise<void> {
    const admins = await Promise.all(
      setupAdminList.map(item => {
        return this.adminService.create(item);
      }),
    );
    console.log(admins.map(item => item.username));

    const stores = await Promise.all(
      setupStoreList.map(item => {
        return this.storeService.create(item);
      }),
    );
    console.log(stores.map(item => item.name));

    const roles = await Promise.all(
      setupStoreRoleList.map(async item => {
        // const { storeId, ...other } = item;
        return this.staffRolesService.create(item);
      }),
    );
    console.log(roles.map(item => item.slug));

    const staffs = await Promise.all(
      setupStaffList.map(item => {
        return this.staffService.create(item);
      }),
    );
    console.log(staffs.map(item => item.username));
  }
}
