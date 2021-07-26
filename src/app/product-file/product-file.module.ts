import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductFileEntity } from './product-file.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductFileEntity])],
  providers: [],
  exports: [],
})
export class ProductFileModule {}
