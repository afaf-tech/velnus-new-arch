import { CreditModule } from '@app/credit/credit.module';
import { InvoiceModule } from '@app/invoice/invoice.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionController, TransactionInStoreController } from './transaction.controller';
import { TransactionEntity } from './transaction.entity';
import { TransactionService } from './transaction.service';

@Module({
  imports: [TypeOrmModule.forFeature([TransactionEntity]), InvoiceModule, CreditModule],
  providers: [TransactionService],
  controllers: [TransactionController, TransactionInStoreController],
  exports: [TransactionService],
})
export class TransactionModule {}
