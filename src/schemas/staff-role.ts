import { OmitType, PartialType } from '@nestjs/mapped-types';
import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class StaffRole {
  @Expose()
  @ApiProperty()
  id!: number;

  @Expose()
  @ApiProperty()
  slug!: string;

  @Expose()
  @ApiProperty()
  name!: string;

  @Expose()
  @ApiProperty()
  permissions!: string[];
}

export class CreateStaffRole extends OmitType(StaffRole, ['id']) {
  @Expose()
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  slug!: string;

  @Expose()
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  name!: string;

  @Expose()
  @IsOptional()
  @IsString({ each: true })
  @ApiResponseProperty()
  permissions!: string[];
}

export class UpdateStaffRole extends PartialType(CreateStaffRole) {}
