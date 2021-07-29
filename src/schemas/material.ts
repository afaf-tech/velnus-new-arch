import { IsDateRange } from '@common/validators';
import { ApiExtraModels, ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString, MinLength } from 'class-validator';

export class Material {
  @ApiProperty({ description: 'Material ID' })
  id: number;

  @ApiProperty({ description: 'Name of material or item', example: 'Kaos polos' })
  name: string;

  @ApiProperty({ description: 'Material description', example: 'Kaos polos dari magelang' })
  description: string;

  @ApiProperty({ description: 'Amout of material avaiable for sale', type: Number, example: '50' })
  stock: number;

  @ApiProperty({
    description: 'The original price of the material',
    example: '3000.00',
    type: Number,
    format: 'decimal',
    multipleOf: 0.01,
  })
  cost: number;

  @ApiProperty({ description: 'Material created date' })
  createdAt: Date;

  @ApiProperty({ description: 'Material updated date' })
  updatedAt: Date;
}

@Exclude()
export class CreateMaterial {
  @Expose()
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Name of material or item', example: 'Kaso Polos' })
  name!: string;

  @Expose()
  @Type(() => String)
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    type: String,
    description: 'Material description',
    example: 'Kaos polos dari magelang',
  })
  description = '';

  @Expose()
  @Type(() => Number)
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 0 })
  @ApiPropertyOptional({
    description: 'Amount of material avaiable for sale',
    example: '50',
    type: Number,
  })
  stock = 0;

  @Expose()
  @Type(() => Number)
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @ApiPropertyOptional({
    description: 'The original price of the material',
    type: Number,
    example: '30000.00',
    format: 'decimal',
    multipleOf: 0.01,
  })
  cost = 0.0;
}

@Exclude()
export class UpdateMaterial {
  @Expose()
  @IsNotEmpty()
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Name of material or item', example: 'Kaso Polos' })
  name!: string;

  @Expose()
  @Type(() => String)
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    type: String,
    description: 'Material description',
    example: 'Kaos polos dari magelang',
  })
  description = '';

  @Expose()
  @Type(() => Number)
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 0 })
  @ApiPropertyOptional({
    description: 'Amount of material avaiable for sale',
    example: '50',
    type: Number,
  })
  stock = 0;

  @Expose()
  @Type(() => Number)
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @ApiPropertyOptional({
    description: 'The original price of the material',
    type: Number,
    example: '30000.00',
    format: 'decimal',
    multipleOf: 0.01,
  })
  cost = 0.0;
}

/**
 * Don't forget every place `GetFilterMateirlaQuerty`, set in property `filter`!
 */
@Exclude()
export class GetFilterMaterialQuery {
  @Expose()
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ name: 'filter[name]' })
  name!: string;

  @Expose()
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ name: 'filter[description]' })
  description!: string;
}

@Exclude()
@ApiExtraModels(GetFilterMaterialQuery)
export class GetMaterialQuery {
  @Expose()
  @IsOptional()
  @MinLength(2)
  @IsString()
  @ApiPropertyOptional({ description: 'Search by name and description' })
  search!: string;

  @Expose()
  @Type(() => GetFilterMaterialQuery)
  @IsOptional()
  @ApiPropertyOptional({ type: () => GetFilterMaterialQuery })
  filter!: GetFilterMaterialQuery;

  @Expose()
  @IsOptional()
  @IsDateRange()
  @ApiPropertyOptional({ example: '2020-07-06_2022-07-06' })
  rangedate!: string;
}
