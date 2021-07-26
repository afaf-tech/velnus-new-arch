import { IsDateRange } from '@common/validators/IsDateRange';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, MinLength, ValidateNested } from 'class-validator';

export class Store {
  @ApiProperty({ description: 'Store ID' })
  id!: number;

  @ApiProperty({ description: 'Store name' })
  name!: string;

  @ApiProperty({ description: 'Store address' })
  address!: string;

  @ApiProperty({ description: 'Store created date' })
  // NOTE: this example onvert additional data tranformation
  // @Type(() => Date)
  // @Transform(({ value }: { value: Date }) => value.toISOString(), { toClassOnly: true })
  createdAt!: Date;

  @ApiProperty({ description: 'Store updated date' })
  updatedAt!: Date;
}

@Exclude()
export class GetStoreFilterQuery {
  @Expose()
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ name: 'filter[name]' })
  name!: string;

  @Expose()
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ name: 'filter[adress]' })
  address!: string;
}

@Exclude()
export class GetStoreQuery {
  @Expose()
  @IsOptional()
  @MinLength(2)
  @IsString()
  @ApiPropertyOptional({ description: 'Filter by name and address' })
  search!: string;

  @Expose()
  @ValidateNested()
  @IsOptional()
  @Type(() => GetStoreFilterQuery)
  @ApiPropertyOptional({ type: () => GetStoreFilterQuery })
  filter!: GetStoreFilterQuery;

  @Expose()
  @IsOptional()
  @IsDateRange()
  @ApiPropertyOptional({ example: '2020-07-06_2022-07-06' })
  rangedate!: string;
}

@Exclude()
export class CreateStore {
  @Expose()
  @IsString()
  @IsNotEmpty()
  @ApiPropertyOptional({ description: 'Store name' })
  name!: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @ApiPropertyOptional({ description: 'Store address' })
  address!: string;
}

@Exclude()
export class UpdateStore {
  @Expose()
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Store name' })
  name!: string;

  @Expose()
  @IsOptional()
  @IsString()
  @MinLength(3)
  @ApiPropertyOptional({ description: 'Store address' })
  address!: string;
}
