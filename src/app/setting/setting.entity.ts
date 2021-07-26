import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CommonEntity, ColumnNumericTransformer } from '@common/database';
import { StoreEntity } from '../store/store.entity';

@Entity('setting')
export class SettingEntity extends CommonEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ nullable: false })
  key: string;

  @Column({ nullable: false })
  value: string;

  @ManyToOne(() => StoreEntity, store => store.setting, { nullable: true })
  store: StoreEntity;

  @Column({ nullable: true, transformer: ColumnNumericTransformer })
  storeId: number;
}
