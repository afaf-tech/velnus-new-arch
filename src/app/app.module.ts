import { Module } from '@nestjs/common';
import config from '@config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ConsoleModule } from 'nestjs-console';
import { WinstonModule } from 'nest-winston';
import { TypeOrmFactory, WinstonModuleFactory } from '@common/factories';
import { TypeOrmModule } from '@nestjs/typeorm';
import AuthModule from './auth';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import AdminModule from './admin';
import StoreModule from './store';
import StaffModule from './staff';
import SetupModule from './setup';
import StaffRoleModule from './staff-role';
import StaffRolePermissionModule from './staff-role-permission';
import PermissionModule from './permission';
import MaterialModule from './material';
import { ProductFileModule } from './product-file';
import ProductModule from './product';
import TransactionModule from './transaction';
import { OrderModule } from './order/order.module';
import { CustomerModule } from './customer/customer.module';

@Module({
  imports: [
    SetupModule,
    TransactionModule,
    ProductFileModule,
    ProductModule,
    MaterialModule,
    StaffRoleModule,
    StaffRolePermissionModule,
    AuthModule,
    StaffModule,
    AdminModule,
    PermissionModule,
    ConsoleModule,
    StoreModule,
    OrderModule,
    CustomerModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useClass: TypeOrmFactory,
    }),
    WinstonModule.forRootAsync({
      imports: [ConfigService],
      inject: [ConfigService],
      useClass: WinstonModuleFactory,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: config,
      envFilePath: ['.env.local', '.env'].concat(process.env.NODE_ENV === 'test' ? ['.local'] : []),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
