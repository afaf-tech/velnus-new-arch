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
import { StoreEntity } from '@app/store/store.entity';
import { StaffEntity } from '@app/staff/staff.entity';
import { InvoiceEntity } from '@app/invoice/invoice.entity';

@Entity('transactions')
export class TransactionEntity extends CommonEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column()
  gateway: string;

  @Column({ nullable: true })
  transactionId: string;

  @Column({ type: 'text' })
  description: string;

  @Column('decimal', {
    precision: 16,
    scale: 2,
    default: 0,
    transformer: ColumnNumericTransformer,
  })
  fees: number;

  @Column('decimal', {
    precision: 16,
    scale: 2,
    default: 0,
    transformer: ColumnNumericTransformer,
  })
  amountIn: number;

  @Column('decimal', {
    precision: 16,
    scale: 2,
    default: 0,
    transformer: ColumnNumericTransformer,
  })
  amountOut: number;

  @Column({ transformer: ColumnNumericTransformer, nullable: true })
  invoiceId: number;

  @Column({ transformer: ColumnNumericTransformer })
  storeId: number;

  @Column({ transformer: ColumnNumericTransformer, nullable: true })
  staffId: number;

  @Column({ transformer: ColumnNumericTransformer, nullable: true })
  refundId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => StoreEntity, store => store.transactions)
  @JoinColumn({ name: 'storeId', referencedColumnName: 'id' })
  store: StoreEntity;

  @ManyToOne(() => StaffEntity, staff => staff.transactions)
  @JoinColumn({ name: 'staffId', referencedColumnName: 'id' })
  staff: StaffEntity;

  @ManyToOne(() => InvoiceEntity, invoice => invoice.transaction)
  @JoinColumn({ name: 'invoiceId' })
  invoice: InvoiceEntity;

  @ManyToOne(() => TransactionEntity, transaction => transaction.refundId)
  @JoinColumn({ name: 'refundId' })
  refund: TransactionEntity;
}
