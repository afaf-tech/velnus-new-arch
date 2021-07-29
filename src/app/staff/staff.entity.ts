import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CommonEntity, ColumnNumericTransformer } from '@common/database';
import { StaffRoleEntity } from '@app/staff-role/staff-role.entity';
import { TransactionEntity } from '@app/transaction/transaction.entity';
import { CreditEntity } from '@app/credit/credit.entity';
import { StoreEntity } from '../store/store.entity';
import { StaffPosition } from './staff.constants';

@Entity('staffs')
export class StaffEntity extends CommonEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  username: string;

  @Column({ type: 'text' })
  password: string;

  @Column()
  name: string;

  @Column()
  address: string;

  @Column({ type: 'enum', enum: StaffPosition, default: StaffPosition.GENERALSTAFF })
  position: StaffPosition;

  @Column({ transformer: ColumnNumericTransformer })
  storeId: number;

  @Column({ transformer: ColumnNumericTransformer })
  roleId: number;

  @Column({ nullable: true })
  createdById?: number;

  @ManyToOne(() => StaffEntity, staff => staff.id)
  @JoinColumn({ name: 'createdById' })
  createdBy: StaffEntity;

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

  @ManyToOne(() => StoreEntity, store => store.staffs)
  store: StoreEntity;

  @ManyToOne(() => StaffRoleEntity, staffRole => staffRole.staff)
  @JoinColumn({ name: 'roleId', referencedColumnName: 'id' })
  role: StaffRoleEntity;

  @ManyToMany(() => TransactionEntity, transaction => transaction.staff)
  transactions: TransactionEntity[];

  @OneToMany(() => CreditEntity, credits => credits.admin)
  credits: CreditEntity[];

  @BeforeInsert()
  @BeforeUpdate()
  public async hashPassword(password?: string): Promise<void> {
    const salt = await bcrypt.genSalt(6);
    if (this.password) {
      this.password = await bcrypt.hash(password || this.password, salt);
    }
  }

  comparePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}
