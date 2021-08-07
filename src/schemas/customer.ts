import { customerColumnSearch } from '@app/customer/customer.constant';
import { CustomerEntity } from '@app/customer/customer.entity';
import { IsDateRange } from '@common/validators';
import { ApiProperty, ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsEmail,
  ValidateNested,
  IsNumber,
} from 'class-validator';

/**
 * Where colum allowing to search
 */
export type CustomerColumnSearch = Pick<
  CustomerEntity,
  'name' | 'address' | 'phoneNumber' | 'email' | 'storeId'
>;

@Exclude()
export class GetCustomerFilterQuery {
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
  @ApiPropertyOptional({ name: 'filter[phoneNumber]' })
  phoneNumber!: string;

  @Expose()
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ name: 'filter[email]' })
  email!: string;

  @Expose()
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 0 })
  @ApiPropertyOptional({ name: 'filter[storeId]' })
  storeId!: number;
}

@Exclude()
export class GetCustomerFilterQueryInStore extends OmitType(GetCustomerFilterQuery, [
  'storeId',
] as const) {}

@Exclude()
export class GetCustomerQuery {
  @Expose()
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: `Filter by ${customerColumnSearch.join(',')}` })
  search!: string;

  @Expose()
  @ValidateNested()
  @IsOptional()
  @Type(() => GetCustomerFilterQuery)
  @ApiPropertyOptional({ type: () => GetCustomerFilterQuery })
  filter!: GetCustomerFilterQuery;

  @Expose()
  @IsOptional()
  @IsDateRange()
  @ApiPropertyOptional({ example: '2020-07-06_2022-07-06' })
  rangedate!: string;
}

@Exclude()
export class GetCustomerQueryInStore extends OmitType(GetCustomerQuery, ['filter'] as const) {
  @Expose()
  @ValidateNested()
  @IsOptional()
  @Type(() => GetCustomerFilterQueryInStore)
  @ApiPropertyOptional({ type: () => GetCustomerFilterQueryInStore })
  filter!: GetCustomerFilterQueryInStore;
}

export class Customer {
  name: string;

  phoneNumber: string;

  email: string;

  address: string;
}

@Exclude()
export class CreateCustomer {
  @Expose()
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Name of Customer', example: 'panda' })
  name!: string;

  @Expose()
  @Type(() => String)
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'phone number',
    example: '0856669998877',
  })
  phoneNumber = '';

  @Expose()
  @Type(() => String)
  @IsOptional()
  @IsEmail()
  @ApiPropertyOptional({
    type: String,
    description: 'email',
    example: 'customer@gmail.com',
  })
  email = '';

  @Expose()
  @IsOptional()
  @ApiProperty({ description: 'default is customer123' })
  password!: 'cusstomer123';

  @Expose()
  @Type(() => String)
  @IsNotEmpty()
  @IsString()
  @ApiPropertyOptional({
    type: String,
    description: 'Customer address',
    example: 'rt embuh',
  })
  address = '';

  @Expose()
  @Type(() => String)
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    type: String,
    description: 'Customer city',
    example: 'magelang',
  })
  kabupaten = '';

  @Expose()
  @Type(() => String)
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    type: String,
    description: 'Customer province',
    example: 'jawa tengah',
  })
  provinsi = '';

  storeId: number;
}

export class UpdateCustomerInStore {
  @Expose()
  @IsOptional()
  @ApiPropertyOptional()
  name!: string;

  @Expose()
  @IsOptional()
  @ApiPropertyOptional()
  phoneNumber: string;

  @Expose()
  @Type(() => String)
  // @IsEmail()
  @IsOptional()
  @ApiPropertyOptional()
  email: string;

  @Expose()
  @IsOptional()
  @ApiPropertyOptional()
  password!: string;

  @Expose()
  @Type(() => String)
  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  address: string;

  @Expose()
  @Type(() => String)
  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  kabupaten: string;

  @Expose()
  @Type(() => String)
  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  provinsi: string;

  storeId: number;
}
