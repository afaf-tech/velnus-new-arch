import { PartialType } from '@nestjs/mapped-types';
import { Exclude, Expose } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

@Exclude()
export class CreateStaffRoleDto {
  @Expose()
  @IsNotEmpty()
  slug: string;

  @Expose()
  @IsNotEmpty()
  name: string;

  @Expose()
  @IsOptional()
  @IsString({ each: true })
  permissions?: string[];
}

export class UpdateStaffRoleDto extends PartialType(CreateStaffRoleDto) {}
