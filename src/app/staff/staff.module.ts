import { forwardRef, Module, Logger } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import StoreModule from '@app/store';
import StaffRoleModule from '@app/staff-role';
import StaffRolePermissionModule from '@app/staff-role-permission';
import { StaffConsole } from './staff.console';
import { StaffEntity } from './staff.entity';
import { StaffService } from './staff.service';
import { StaffController, StaffInStoreController } from './staff.controller';

@Module({
  imports: [
    StaffRoleModule,
    StaffRolePermissionModule,
    forwardRef(() => StoreModule),
    TypeOrmModule.forFeature([StaffEntity]),
  ],
  providers: [StaffConsole, StaffService, Logger],
  controllers: [StaffController, StaffInStoreController],
  exports: [StaffService],
})
export class StaffModule {}
// export class StaffModule implements NestModule {
//   configure(consumer: MiddlewareConsumer) {
//     // consumer.apply(PermissionStoreMiddleware).forRoutes(StaffController);
//   }
// }
