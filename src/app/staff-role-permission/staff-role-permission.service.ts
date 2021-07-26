import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { StaffRolePermissionEntity } from './staff-role-permission.entity';

@Injectable()
export class StaffRolePermissionService {
  constructor(
    @InjectRepository(StaffRolePermissionEntity)
    private readonly staffRolePermissionRepository: Repository<StaffRolePermissionEntity>,
  ) {}

  get repository(): Repository<StaffRolePermissionEntity> {
    return this.staffRolePermissionRepository;
  }

  addPermissions(
    storeId: number,
    roleId: number,
    permission: string | string[],
    options: { entityManager?: EntityManager } = {},
  ): Promise<StaffRolePermissionEntity | StaffRolePermissionEntity[]> {
    if (Array.isArray(permission)) {
      const entities = permission.map(item => {
        const entity = this.staffRolePermissionRepository.create();
        Object.assign(entity, { permission: item, storeId, roleId });
        return entity;
      });

      if (options.entityManager) {
        return options.entityManager.save(entities);
      }

      return this.staffRolePermissionRepository.save(entities);
    }

    const entity = this.staffRolePermissionRepository.create();
    Object.assign(entity, { permission, storeId, roleId });

    if (options.entityManager) {
      return options.entityManager.save(entity);
    }

    return this.staffRolePermissionRepository.save(entity);
  }
}
