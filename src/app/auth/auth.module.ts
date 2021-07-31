import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import StaffModule from '@app/staff';
import StoreModule from '@app/store';
import AdminModule from '@app/admin';
import StaffRoleModule from '@app/staff-role';
import { AllExceptionsFilter } from '@common/filters';
import { APP_FILTER } from '@nestjs/core';
import { ConfigApp } from '@config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    AdminModule,
    StaffModule,
    StaffRoleModule,
    StoreModule,
    PassportModule.register({ session: false }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<ConfigApp['secretKey']>('app.secretKey'),
        signOptions: {
          expiresIn: configService.get('jwt_expiration'),
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
    Logger,
  ],
  exports: [AuthService],
})
export class AuthModule {}
