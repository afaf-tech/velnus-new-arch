import { LoginType } from '@app/auth/auth.constants';
import { ApiExtraModels, ApiProperty, refs } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { IsRequired } from '@common/validators';
import * as staff from './staff';
import * as admin from './admin';

@Exclude()
export class AuthLogin {
  @Expose()
  @IsRequired()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'User username' })
  username: string;

  @Expose()
  @IsRequired()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, description: 'User password' })
  password: string;
}

@Exclude()
@ApiExtraModels(staff.Staff, admin.Admin)
export class AuthCredential {
  @Expose()
  @ApiProperty()
  accessToken: string;

  @Expose()
  @ApiProperty({ enum: LoginType })
  type: LoginType;

  @Expose()
  @ApiProperty({
    type: () => Object,
    oneOf: refs(staff.Staff, admin.Admin),
  })
  account: staff.Staff | admin.Admin;

  @Expose()
  @ApiProperty({ type: [String] })
  permissions: string[];
}
