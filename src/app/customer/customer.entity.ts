import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { IsEmail } from 'class-validator';
import { CommonEntity, ColumnNumericTransformer } from '@common/database';
import { StoreEntity } from '../store/store.entity';

@Entity('customers')
export class CustomerEntity extends CommonEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  phoneNumber: string;

  @Column()
  address: string;

  @Column({ type: 'varchar', unique: true, nullable: true })
  @IsEmail()
  email: string;

  @Column({ type: 'varchar', select: false, nullable: true })
  password: string;

  @Column({ nullable: true })
  kabupaten: string;

  @Column({ nullable: true })
  provinsi: string;

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

  @ManyToOne(() => StoreEntity, store => store.customers, { nullable: false })
  @JoinColumn({ name: 'storeId', referencedColumnName: 'id' })
  store: StoreEntity;

  @Column({ nullable: true, transformer: ColumnNumericTransformer })
  storeId: number;

  @BeforeInsert()
  async setPassword(password: string) {
    if (this.password) {
      const salt = await bcrypt.genSalt(6);
      this.password = await bcrypt.hash(password || this.password, salt);
    }
  }

  comparePassword(attempt: string): Promise<boolean> {
    return bcrypt.compare(attempt, this.password);
  }
}
