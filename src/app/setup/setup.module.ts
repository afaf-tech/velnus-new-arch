import AdminModule from '@app/admin';
import StaffModule from '@app/staff';
import StaffRoleModule from '@app/staff-role';
import StoreService from '@app/store';
import { Module } from '@nestjs/common';
import { SetupService } from './setup.service';

@Module({
  imports: [StaffModule, AdminModule, StoreService, StaffRoleModule],
  providers: [SetupService],
  exports: [SetupService],
})
export class SetupModule {}
