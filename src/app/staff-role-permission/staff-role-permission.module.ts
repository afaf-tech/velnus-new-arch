import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StaffRolePermissionEntity } from './staff-role-permission.entity';
import { StaffRolePermissionService } from './staff-role-permission.service';

@Module({
  imports: [TypeOrmModule.forFeature([StaffRolePermissionEntity])],
  providers: [StaffRolePermissionService],
  exports: [StaffRolePermissionService],
})
export class StaffRolePermissionModule {}
