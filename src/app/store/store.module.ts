import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoreConsole } from './store.console';
import { StoreEntity } from './store.entity';
import { StoreService } from './store.service';
import { StoreController } from './store.controller';

@Module({
  imports: [TypeOrmModule.forFeature([StoreEntity])],
  providers: [StoreConsole, StoreService],
  controllers: [StoreController],
  exports: [StoreService],
})
export class StoreModule {}
