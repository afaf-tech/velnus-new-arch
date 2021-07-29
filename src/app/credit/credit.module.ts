import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreditEntity } from './credit.entity';
import { CreditService } from './credit.service';

@Module({
  imports: [TypeOrmModule.forFeature([CreditEntity])],
  providers: [CreditService],
  exports: [CreditService],
})
export class CreditModule {}
