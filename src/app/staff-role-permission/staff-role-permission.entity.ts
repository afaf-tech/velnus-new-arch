import { StaffRoleEntity } from '@app/staff-role/staff-role.entity';
import { StoreEntity } from '@app/store/store.entity';
import { ColumnNumericTransformer } from '@common/database';
import { Column, CreateDateColumn, Entity, ManyToOne, UpdateDateColumn } from 'typeorm';

@Entity('staff_role_permissions')
export class StaffRolePermissionEntity {
  @Column({ primary: true })
  permission: string;

  @Column({ transformer: ColumnNumericTransformer, primary: true })
  roleId: number;

  @Column({ transformer: ColumnNumericTransformer, primary: true })
  storeId: number;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updatedAt: Date;

  @ManyToOne(() => StoreEntity, store => store.staffRolePermission, {
    primary: true,
    onDelete: 'CASCADE',
  })
  store: StaffRoleEntity;

  @ManyToOne(() => StaffRoleEntity, staffRole => staffRole.permissions, {
    primary: true,
    onDelete: 'CASCADE',
  })
  role: StaffRoleEntity;
}
