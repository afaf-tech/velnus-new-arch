import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvoiceItemEntity } from './invoice-item.entity';
import { InvoiceEntity } from './invoice.entity';
import { InvoiceService } from './invoice.service';

@Module({
  imports: [TypeOrmModule.forFeature([InvoiceEntity, InvoiceItemEntity])],
  providers: [InvoiceService],
  controllers: [],
  exports: [InvoiceService],
})
export class InvoiceModule {}
