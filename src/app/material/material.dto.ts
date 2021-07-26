import { IsInt, IsNotEmpty, IsOptional } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
export class CreateMaterialDto {
  @Expose()
  @IsNotEmpty()
  name: string;

  @Expose()
  @IsOptional()
  description?: string;

  @Expose()
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  slock?: number;

  @Expose()
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  cost?: number;

  @Expose()
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  price?: number;
}

export class UpdateMaterialDto extends PartialType(CreateMaterialDto) {}
