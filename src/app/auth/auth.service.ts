import { Inject, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { permissions as BasePermissions } from '@app/permission/permission.constants';
import { AdminEntity } from '@app/admin/admin.entity';
import { StaffEntity } from '@app/staff/staff.entity';
import { AdminService } from '@app/admin/admin.service';
import { StaffService } from '@app/staff/staff.service';
import { JwtPayload } from '@common/interfaces';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { ErrorBase } from '@common/exceptions';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ConfigApp, ConfigAuthentication } from '@config';
import { plainToClass } from 'class-transformer';
import { AuthCredential, Admin, Staff, AuthLogin } from '@schemas';
import { LoginType } from './auth.constants';

@Injectable()
export class AuthService {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: Logger,
    private readonly jwtServie: JwtService,
    private readonly configService: ConfigService,
    private readonly staffService: StaffService,
    private readonly adminService: AdminService,
  ) {
    this.logger.setContext('AuthService');
  }

  /**
   * alternative for staffService.getPermission
   */
  getPermission(staff: StaffEntity): Promise<string[]> {
    return this.staffService.getPermissions(staff);
  }

  /**
   * Get user data
   */
  private getAccount(
    type: LoginType,
    user: number | string,
  ): Promise<AdminEntity | StaffEntity | undefined> {
    if (type === 'staff') {
      return this.staffService.get(user);
    }
    if (type === 'admin') {
      return this.adminService.get(user);
    }

    return undefined;
  }

  async login(loginType: LoginType, data: AuthLogin): Promise<AuthCredential> {
    this.logger.log(`Login (${loginType}): ${JSON.stringify(data)}`);
    const entity = await this.getAccount(loginType, data.username);

    if (!entity) {
      throw new UnauthorizedException(
        new ErrorBase('Login Failed', { devMessage: `User "${data.username}" doest not exits` }),
      );
    }

    const valid = await entity.comparePassword(data.password);
    if (!valid) {
      throw new UnauthorizedException(
        new ErrorBase('Login Failed', { devMessage: `Wrong user password` }),
      );
    }

    const payload: JwtPayload = { id: entity.id, type: loginType };

    const jwtExpiration = this.configService.get<ConfigAuthentication['jwt_expiration']>(
      'authentication.jwt_expiration',
    );
    const secretKey = this.configService.get<ConfigApp['secretKey']>('app.secretKey');
    const accessToken = this.jwtServie.sign(payload, {
      secret: secretKey,
      expiresIn: jwtExpiration,
    });

    let account: Staff | Admin;
    let permissions: string[] = [];
    if (loginType === 'staff') {
      account = plainToClass<Staff, StaffEntity>(Staff, entity as StaffEntity);
      permissions = await this.staffService.getPermissions(entity as StaffEntity);
    }

    return plainToClass(AuthCredential, {
      accessToken,
      type: loginType,
      account,
      permissions,
    });
  }

  /**
   * Validate passport strategy
   */
  async validate(payload: JwtPayload): Promise<AuthCredential> {
    const entity = await this.getAccount(LoginType[payload.type?.toUpperCase()], payload.id);
    if (!entity) throw new Error('Invalid session type');

    let account: Admin | Staff;
    let permissions: string[] = [];
    if (payload.type === 'staff') {
      account = plainToClass<Staff, StaffEntity>(Staff, entity as StaffEntity);
      permissions = await this.staffService.getPermissions(entity as StaffEntity);
    } else if (payload.type === 'admin') {
      account = plainToClass<Admin, AdminEntity>(Admin, entity as AdminEntity);
      permissions = BasePermissions.map(item => item.id);
    }

    return plainToClass(AuthCredential, {
      type: payload.type,
      account,
      permissions,
    });
  }
}
