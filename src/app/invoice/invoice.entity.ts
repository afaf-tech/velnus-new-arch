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
import { CommonEntity, ColumnNumericTransformer } from '@common/database';
import { TransactionEntity } from '@app/transaction/transaction.entity';
import { StoreEntity } from '../store/store.entity';
import { InvoiceItemEntity } from './invoice-item.entity';

@Entity('invoices')
export class InvoiceEntity extends CommonEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ nullable: false })
  customerId: number;

  @Column({ type: 'datetime' })
  date: Date;

  @Column({ type: 'datetime', nullable: true })
  dueDate: Date;

  @Column({ type: 'datetime', nullable: true })
  paidDate: Date;

  @Column({ type: 'datetime', nullable: true })
  dateRefunded: Date;

  @Column({ type: 'datetime', nullable: true })
  dateCancelled: Date;

  @Column({ nullable: true, transformer: ColumnNumericTransformer })
  storeId: number;

  @Column('decimal', {
    precision: 10,
    scale: 2,
    default: 0,
    transformer: ColumnNumericTransformer,
  })
  subtotal: number;

  @Column('decimal', {
    precision: 10,
    scale: 2,
    default: 0,
    transformer: ColumnNumericTransformer,
  })
  total: number;

  @Column()
  status: string;

  @Column()
  paymentMethod: string;

  @Column({ type: 'text' })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ transformer: ColumnNumericTransformer })
  orderId: number;

  @OneToMany('invoice_items', 'invoice', {
    cascade: true,
  })
  invoiceItems: InvoiceItemEntity[];

  @ManyToOne('stores', 'invoices')
  @JoinColumn({ name: 'storeId', referencedColumnName: 'id' })
  store: StoreEntity;

  @ManyToOne(() => TransactionEntity, transaction => transaction.invoice)
  transaction: TransactionEntity;
}
