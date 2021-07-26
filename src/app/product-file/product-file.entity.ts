import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ColumnNumericTransformer, CommonEntity } from '@common/database';
import { ProductEntity } from '@app/product/product.entity';

@Entity({ name: 'product_files' })
export class ProductFileEntity extends CommonEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column()
  type: string;

  @Column()
  location: string;

  @Column({ transformer: ColumnNumericTransformer })
  productId: number;

  @ManyToOne(() => ProductEntity, product => product.files)
  product: ProductEntity;

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
}
