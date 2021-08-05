import { IsDateRange } from '@common/validators';
import { OmitType } from '@nestjs/mapped-types';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

@Exclude()
export class Transaction {
  @Expose()
  @ApiProperty()
  id!: number;

  @Expose()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Gateway name or payment method' })
  gateway!: string;

  @Expose()
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'its a unique code from gateway' })
  transactionId!: string;

  @Expose()
  @IsOptional()
  @ApiPropertyOptional()
  description!: string;

  @Expose()
  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional()
  fees!: number;

  @Expose()
  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({ description: 'amount out' })
  amountIn!: number;

  @Expose()
  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({ description: 'amount in' })
  amountOut!: number;

  @Expose()
  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional()
  invoiceId!: number;

  @Expose()
  @IsNumber()
  @ApiProperty()
  storeId!: number;

  @Expose()
  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional()
  staffId!: number;

  @Expose()
  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional()
  refundId!: number;

  @Expose()
  @ApiProperty()
  createdAt!: Date;

  @Expose()
  @ApiProperty()
  updatedAt!: Date;
}

export class CreateTransaction extends OmitType(Transaction, [
  'id',
  'refundId',
  'createdAt',
  'updatedAt',
] as const) {}

export class CreateTransactionInStore extends CreateTransaction {}

export class PayTransactionOrder {
  @Expose()
  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 0 })
  @ApiProperty({ description: 'invoiceId' })
  invoiceId: number;

  @Expose()
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @ApiProperty({
    description: 'amount of total order',
    type: Number,
    example: '30000.00',
    format: 'decimal',
    multipleOf: 0.01,
  })
  amountIn: number;

  staffId: number;

  storeId: number;
}
@Exclude()
export class GetTransactionFilterQuery {
  @Expose()
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ name: 'filter[gateway]' })
  gateway!: string;

  @Expose()
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ name: 'filter[description]' })
  description!: string;
}

@Exclude()
export class GetTransactionQuery {
  @Expose()
  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  search!: string;

  @Expose()
  @IsOptional()
  @Type(() => GetTransactionFilterQuery)
  @ApiPropertyOptional({ type: () => Object })
  filter: GetTransactionFilterQuery;

  @Expose()
  @IsOptional()
  @IsDateRange()
  @ApiPropertyOptional({ example: '2020-07-06_2022-07-06' })
  rangedate!: string;
}
