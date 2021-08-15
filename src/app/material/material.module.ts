import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MaterialEntity } from './material.entity';
import { MaterialService } from './material.service';
import { MaterialController, MaterialStoreController } from './material.controller';

@Module({
  imports: [TypeOrmModule.forFeature([MaterialEntity])],
  providers: [MaterialService],
  controllers: [MaterialController, MaterialStoreController],
  exports: [MaterialService],
})
export class MaterialModule {}
