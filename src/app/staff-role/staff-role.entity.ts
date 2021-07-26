import { StaffRolePermissionEntity } from '@app/staff-role-permission/staff-role-permission.entity';
import { StaffEntity } from '@app/staff/staff.entity';
import { StoreEntity } from '@app/store/store.entity';
import { ColumnNumericTransformer, CommonEntity } from '@common/database';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('staff_roles')
export class StaffRoleEntity extends CommonEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ unique: true })
  slug: string;

  @Column()
  name: string;

  @Column({ transformer: ColumnNumericTransformer })
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

  @ManyToOne(() => StoreEntity, store => store.staffRoles)
  @JoinColumn({ name: 'storeId', referencedColumnName: 'id' })
  store: StoreEntity;

  @OneToMany(() => StaffEntity, staff => staff.role)
  staff: StaffEntity;

  @OneToMany(() => StaffRolePermissionEntity, staffRolePermission => staffRolePermission.role)
  permissions: StaffRolePermissionEntity[];
}
