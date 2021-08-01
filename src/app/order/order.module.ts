import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { InvoiceModule } from '@app/invoice/invoice.module';
import ProductModule from '@app/product';
import { OrderStoreController } from './order.controller';
import { OrderEntity } from './order.entity';
import { OrderService } from './order.service';

@Module({
  imports: [TypeOrmModule.forFeature([OrderEntity]), InvoiceModule, ProductModule],
  providers: [OrderService],
  controllers: [OrderStoreController],
})
export class OrderModule {}
