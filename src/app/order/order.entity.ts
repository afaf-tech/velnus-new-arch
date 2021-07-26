import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CommonEntity, ColumnNumericTransformer } from '@common/database';
import { StoreEntity } from '../store/store.entity';

@Entity('orders')
export class OrderEntity extends CommonEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'bigint' })
  orderNum: number;

  @Column({ type: 'datetime' })
  date: Date;

  @Column({ default: 'pending' })
  status: string; // pending | proses | selesai | cancelled

  @Column({ type: 'text' })
  description: string;

  @Column()
  paymentMethod: string;

  @Column('decimal', {
    precision: 16,
    scale: 2,
    default: 0,
    transformer: ColumnNumericTransformer,
  })
  amount: number;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    select: false,
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
    select: false,
  })
  updatedAt: Date;

  @Column({ type: 'text' })
  notes: string;

  @ManyToOne(() => StoreEntity, store => store.orders)
  @JoinColumn({ name: 'storeId', referencedColumnName: 'id' })
  store: StoreEntity;

  @Column({ nullable: false, transformer: ColumnNumericTransformer })
  storeId: number;
}
