import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CommonEntity, ColumnNumericTransformer } from '@common/database';
import { ProductEntity } from '../product/product.entity';

@Entity({ name: 'materials' })
export class MaterialEntity extends CommonEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column()
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ precision: 11, transformer: ColumnNumericTransformer, default: 0 })
  stock: number;

  @Column('decimal', {
    precision: 16,
    scale: 2,
    default: 0,
    transformer: ColumnNumericTransformer,
  })
  cost: number;

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

  @ManyToMany(() => ProductEntity)
  @JoinTable({
    name: 'product_materials',
    joinColumn: {
      name: 'materialId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'productId',
      referencedColumnName: 'id',
    },
  })
  products: ProductEntity[];
}
