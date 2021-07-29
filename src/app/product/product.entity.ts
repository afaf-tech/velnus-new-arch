import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CommonEntity, ColumnNumericTransformer } from '@common/database';
import { MaterialEntity } from '@app/material/material.entity';
import { ProductFileEntity } from '@app/product-file/product-file.entity';
import { StoreEntity } from '../store/store.entity';

@Entity({ name: 'products' })
export class ProductEntity extends CommonEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ transformer: ColumnNumericTransformer })
  storeId: number;

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

  @Column('decimal', {
    precision: 16,
    scale: 2,
    default: 0,
    transformer: ColumnNumericTransformer,
  })
  price: number;

  @Column('decimal', {
    precision: 16,
    scale: 2,
    default: 0,
    transformer: ColumnNumericTransformer,
  })
  fee: number;

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

  @OneToMany(() => ProductFileEntity, productFile => productFile.product)
  files: ProductFileEntity[];

  @ManyToOne(() => StoreEntity, store => store.products, { nullable: false })
  @JoinColumn({ name: 'storeId', referencedColumnName: 'id' })
  store: StoreEntity;

  @ManyToMany(() => MaterialEntity, material => material.products)
  @JoinTable()
  @JoinTable({
    name: 'product_materials',
    joinColumn: {
      name: 'productId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'materialId',
      referencedColumnName: 'id',
    },
  })
  materials: MaterialEntity[];
}
