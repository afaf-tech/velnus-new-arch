import { IsDateRange } from '@common/validators';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsNotEmpty, IsOptional } from 'class-validator';

@Exclude()
export class Admin {
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
  createdAt!: Date;

  @Expose()
  @ApiProperty()
  updatedAt!: Date;
}

@Exclude()
export class GetAdminQuery {
  @Expose()
  search!: string;

  @Expose()
  @IsOptional()
  @IsDateRange()
  @ApiPropertyOptional({ example: '2020-07-06_2022-07-06' })
  rangedate!: string;
}

@Exclude()
export class CreateAdmin {
  @Expose()
  @IsNotEmpty()
  @ApiProperty()
  username!: string;

  @Expose()
  @IsNotEmpty()
  @ApiProperty()
  password!: string;
}

@Exclude()
export class UpdateAdmin {
  @Expose()
  @IsOptional()
  @ApiPropertyOptional()
  username!: string;

  @Expose()
  @IsOptional()
  @ApiPropertyOptional()
  password!: string;
}
