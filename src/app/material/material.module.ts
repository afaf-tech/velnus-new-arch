import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MaterialEntity } from './material.entity';
import { StaffModule } from '../staff/staff.module';
import { MaterialService } from './material.service';
import { MaterialController } from './material.controller';

@Module({
  imports: [TypeOrmModule.forFeature([MaterialEntity]), StaffModule],
  providers: [MaterialService],
  controllers: [MaterialController],
  exports: [MaterialService],
})
export class MaterialModule {}
