import { ApiProperty, ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { staffColumnSearch, StaffPosition } from '@app/staff/staff.constants';
import { IsDateRange } from '@common/validators';

@Exclude()
export class Staff {
  @Expose()
  @ApiProperty()
  id!: string;

  @Expose()
  @ApiProperty()
  username!: string;

  @Expose()
  @ApiProperty()
  name!: string;

  @Expose()
  @ApiProperty()
  address!: string;

  @Expose()
  @ApiProperty({ enum: StaffPosition })
  position!: string;

  @Expose()
  @ApiProperty()
  storeId!: number;

  @Expose()
  @ApiProperty()
  roleId!: number;

  @Expose()
  @ApiProperty()
  createdAt!: Date;

  @Expose()
  @ApiProperty()
  updatedAt!: Date;
}

@Exclude()
export class GetStaffFilterQuery {
  @Expose()
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ name: 'filter[username]' })
  username!: string;

  @Expose()
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ name: 'filter[name]' })
  name!: string;

  @Expose()
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ name: 'filter[adress]', required: false })
  address!: string;

  @Expose()
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ name: 'filter[position]', enum: StaffPosition })
  position!: string;

  @Expose()
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 0 })
  @ApiPropertyOptional({ name: 'filter[storeId]' })
  storeId!: number;

  @Expose()
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({ name: 'filter[roleId]' })
  roleId!: number;
}

@Exclude()
export class GetStaffFilterQueryInStore extends OmitType(GetStaffFilterQuery, [
  'storeId',
] as const) {}

@Exclude()
export class GetStaffQuery {
  @Expose()
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: `Filter by ${staffColumnSearch.join(',')}` })
  search!: string;

  @Expose()
  @ValidateNested()
  @IsOptional()
  @Type(() => GetStaffFilterQuery)
  @ApiPropertyOptional({ type: () => GetStaffFilterQuery })
  filter!: GetStaffFilterQuery;

  @Expose()
  @IsOptional()
  @IsDateRange()
  @ApiPropertyOptional({ example: '2020-07-06_2022-07-06' })
  rangedate!: string;
}

@Exclude()
export class GetStaffQueryInStore extends OmitType(GetStaffQuery, ['filter'] as const) {
  @Expose()
  @ValidateNested()
  @IsOptional()
  @Type(() => GetStaffFilterQueryInStore)
  @ApiPropertyOptional({ type: () => GetStaffFilterQueryInStore })
  filter!: GetStaffFilterQueryInStore;
}

@Exclude()
export class CreateStaff {
  @Expose()
  @IsString()
  @ApiProperty()
  username!: string;

  @Expose()
  @IsString()
  @ApiProperty()
  password!: string;

  @Expose()
  @IsString()
  @ApiProperty()
  name!: string;

  @Expose()
  @IsString()
  @ApiProperty()
  address!: string;

  @Expose()
  @IsNumber({ maxDecimalPlaces: 0 })
  @ApiProperty()
  storeId!: number;

  @Expose()
  @IsNumber({ maxDecimalPlaces: 0 })
  @ApiProperty()
  roleId!: number;

  @Expose()
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ enum: StaffPosition, default: StaffPosition.GENERALSTAFF })
  position!: StaffPosition;
}

@Exclude()
export class CreateStaffInStore extends OmitType(CreateStaff, ['storeId'] as const) {}

@Exclude()
export class UpdateStaffInStore {
  @Expose()
  @IsOptional()
  @IsNotEmpty()
  @ApiPropertyOptional()
  username!: string;

  @Expose()
  @IsOptional()
  @IsNotEmpty()
  @ApiPropertyOptional()
  password!: string;

  @Expose()
  @IsOptional()
  @IsNotEmpty()
  @ApiPropertyOptional()
  name!: string;

  @Expose()
  @IsOptional()
  @IsNotEmpty()
  @ApiPropertyOptional()
  address!: string;

  @Expose()
  @IsOptional()
  @IsNotEmpty()
  @ApiPropertyOptional({ enum: StaffPosition })
  position!: StaffPosition;

  @Expose()
  @IsOptional()
  @IsInt()
  @ApiPropertyOptional()
  roleId!: number;
}

@Exclude()
export class UpdateStaff extends UpdateStaffInStore {
  @Expose()
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 0 })
  @ApiPropertyOptional()
  storeId!: number;
}
