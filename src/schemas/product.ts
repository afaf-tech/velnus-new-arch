import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Material } from '@schemas';
import { Exclude, Expose, Type, Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class Product {
  @Expose()
  @ApiProperty()
  id!: number;

  @Expose()
  @ApiProperty()
  name!: number;

  @Expose()
  @ApiProperty()
  description: string;

  @Expose()
  @ApiProperty()
  stock: number;

  @Expose()
  @ApiProperty()
  price: number;

  @Expose()
  @Type(() => Material)
  @ApiProperty()
  materials: Material[];
}

@Exclude()
export class CreateProduct {
  @Expose()
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Name of Product', example: 'Cat vs Tiger Kaos' })
  name!: string;

  @Expose()
  @Type(() => String)
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    type: String,
    description: 'Product description',
    example: 'Kaos polos dari magelang',
  })
  description = '';

  @Expose()
  @Type(() => Number)
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 0 })
  @IsNotEmpty()
  @ApiPropertyOptional({
    description: 'Amount of Product avaiable for sale',
    example: '1',
    type: Number,
  })
  stock: number;

  @Expose()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @ApiProperty({
    description:
      'The original price of the product, must be greater than or equal to materials used',
    type: Number,
    example: '30000.00',
    format: 'decimal',
    multipleOf: 0.01,
  })
  price = 0.0;

  @Expose()
  @Type(() => String)
  @Transform(
    ({ value }: { value: string }) => {
      return value.split(',').map<number>(e => Number(e));
    },
    {
      toClassOnly: true,
    },
  )
  @IsNumber({ maxDecimalPlaces: 0 }, { each: true })
  @ApiProperty({
    description: 'Array of material ids',
    type: [Number],
  })
  materialids: string[];

  storeId: number;
}

/**
 * Don't forget every place `GetFilterProductQuerty`, set in property `filter`!
 */
@Exclude()
export class GetFilterProductQuery {
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
