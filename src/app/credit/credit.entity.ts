import { CommonEntity, ColumnNumericTransformer } from '@common/database';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { StaffEntity } from '../staff/staff.entity';
import { StoreEntity } from '../store/store.entity';

@Entity({ name: 'credit' })
export class CreditEntity extends CommonEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column('decimal', {
    precision: 16,
    scale: 2,
    default: 0,
    transformer: ColumnNumericTransformer,
  })
  total: number;

  @Column({ nullable: true, transformer: ColumnNumericTransformer })
  invoiceId?: number;

  @Column({ nullable: true, transformer: ColumnNumericTransformer })
  transactionId?: number;

  @Column({ nullable: true, transformer: ColumnNumericTransformer })
  productId?: number;

  @ManyToOne(() => StoreEntity, store => store.credits, { nullable: false })
  store: StoreEntity;

  @Column('decimal', {
    nullable: true,
    transformer: ColumnNumericTransformer,
  })
  storeId: number;

  @ManyToOne(() => StaffEntity, staff => staff.credits, { nullable: false })
  admin: StaffEntity;

  @Column('decimal', {
    nullable: true,
    transformer: ColumnNumericTransformer,
  })
  adminId: number;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    select: true,
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
    select: true,
  })
  updatedAt: Date;
}
