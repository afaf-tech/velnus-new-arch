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
import { InvoiceEntity } from './invoice.entity';

@Entity('invoice_items')
export class InvoiceItemEntity extends CommonEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'text' })
  description: string;

  @Column({ nullable: false, transformer: ColumnNumericTransformer })
  relId: number; // relation to product id

  @Column('decimal', {
    precision: 10,
    scale: 2,
    default: 0,
    transformer: ColumnNumericTransformer,
  })
  amountEach: number;

  @Column('decimal', {
    precision: 10,
    scale: 2,
    default: 0,
    transformer: ColumnNumericTransformer,
  })
  total: number;

  @Column({ precision: 11, transformer: ColumnNumericTransformer })
  quantity: number;

  @Column({ type: 'datetime', nullable: true })
  dueDate: Date;

  @Column()
  paymentMethod: string;

  @Column({ type: 'text' })
  notes?: string;

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

  @ManyToOne('InvoiceEntity', 'invoiceItems', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'invoiceId', referencedColumnName: 'id' })
  invoice: InvoiceEntity;

  @Column({ nullable: false, transformer: ColumnNumericTransformer })
  customerId: number;
}
