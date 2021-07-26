import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

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
    description: 'Material description',
    example: 'Kaos polos dari magelang',
  })
  description = '';
}
