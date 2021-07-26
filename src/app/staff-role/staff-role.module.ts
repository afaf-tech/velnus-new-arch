import StaffRolePermissionModule from '@app/staff-role-permission';
import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StaffRoleConsole } from './staff-role.console';
import { StaffRoleEntity } from './staff-role.entity';
import { StaffRoleService } from './staff-role.service';

@Module({
  imports: [TypeOrmModule.forFeature([StaffRoleEntity]), StaffRolePermissionModule],
  providers: [StaffRoleConsole, StaffRoleService, Logger],
  exports: [StaffRoleService],
})
export class StaffRoleModule {}
