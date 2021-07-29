import { CreditModule } from '@app/credit/credit.module';
import MaterialModule from '@app/material';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductStoreController } from './product.controller';
import { ProductEntity } from './product.entity';
import { ProductService } from './product.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity]), MaterialModule, CreditModule],
  providers: [ProductService],
  controllers: [ProductStoreController],
  exports: [],
})
export class ProductModule {}
