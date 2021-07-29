import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { CommonEntity } from '@common/database';
import { StaffRoleEntity } from '@app/staff-role/staff-role.entity';
import { StaffRolePermissionEntity } from '@app/staff-role-permission/staff-role-permission.entity';
import { TransactionEntity } from '@app/transaction/transaction.entity';
import { StaffEntity } from '../staff/staff.entity';
import { CustomerEntity } from '../customer/customer.entity';
import { InvoiceEntity } from '../invoice/invoice.entity';
import { ProductEntity } from '../product/product.entity';
import { SettingEntity } from '../setting/setting.entity';
import { OrderEntity } from '../order/order.entity';
import { CreditEntity } from '../credit/credit.entity';

@Entity('stores')
export class StoreEntity extends CommonEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column()
  name: string;

  @Column()
  address: string;

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

  @OneToMany(() => InvoiceEntity, transaction => transaction.store)
  invoices: InvoiceEntity[];

  @OneToMany(() => OrderEntity, order => order.store)
  orders: OrderEntity[];

  @OneToMany(() => StaffEntity, staff => staff.store)
  staffs: StaffEntity[];

  @OneToMany(() => StaffRoleEntity, staffRole => staffRole.store)
  staffRoles: StaffRoleEntity[];

  @OneToMany(() => StaffRolePermissionEntity, staffRolePermission => staffRolePermission.store)
  staffRolePermission: StaffRolePermissionEntity[];

  @OneToMany(() => ProductEntity, product => product.store)
  products: ProductEntity[];

  @OneToMany(() => TransactionEntity, transaction => transaction.store)
  transactions: TransactionEntity[];

  @OneToMany(() => CustomerEntity, customer => customer.store)
  customers: CustomerEntity[];

  @OneToMany(() => CreditEntity, credits => credits.store)
  credits: CreditEntity[];

  @OneToMany(() => SettingEntity, setting => setting.store)
  setting: SettingEntity[];
}
