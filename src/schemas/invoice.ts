import { invoiceColumnSearch, InvoiceStatusEnum } from '@app/invoice/invoice.constant';
import { InvoiceEntity } from '@app/invoice/invoice.entity';
import { IsDateRange } from '@common/validators';
import { OmitType } from '@nestjs/mapped-types';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { ValidateNested, IsOptional, IsString } from 'class-validator';

export class Invoice {
  @ApiProperty()
  id: number;

  @ApiProperty()
  storeId: number;

  @ApiProperty()
  orderId: number;

  @ApiProperty()
  customerId: number;

  @ApiPropertyOptional()
  date: Date;

  @ApiPropertyOptional()
  dueDate: Date;

  @ApiPropertyOptional()
  paidDate: Date;

  @ApiPropertyOptional()
  dateRefunded: Date;

  @ApiPropertyOptional()
  dateCancelled: Date;

  @ApiProperty()
  subtotal: number;

  @ApiProperty()
  total: number;

  @ApiProperty()
  status: string;

  @ApiProperty()
  paymentMethod: string;

  @ApiPropertyOptional()
  notes: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class CreateInvoice extends OmitType(Invoice, [
  'id',
  'dueDate',
  'paidDate',
  'dateRefunded',
  'dateCancelled',
  'paymentMethod',
  'createdAt',
  'updatedAt',
] as const) {}

/**
 * Don't forget every place `GetFilterProductQuerty`, set in property `filter`!
 */
@Exclude()
export class GetFilterInvoiceQuery {
  @Expose()
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ name: 'filter[customerId]' })
  customerId!: string;

  @Expose()
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    name: 'filter[status]',
    description: Object.values(InvoiceStatusEnum).join(' | '),
    enum: InvoiceStatusEnum,
  })
  status!: string;
}

export class CreateInvoiceInStore extends OmitType(CreateInvoice, ['storeId']) {}
/**
 * Where colum allowing to search
 */
export type InvoiceColumnSearch = Pick<InvoiceEntity, 'customerId' | 'status'>;

@Exclude()
export class GetInvoiceQuery {
  @Expose()
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: `Filter by ${invoiceColumnSearch.join(',')}` })
  search!: string;

  @Expose()
  @ValidateNested()
  @IsOptional()
  @Type(() => GetFilterInvoiceQuery)
  @ApiPropertyOptional({ type: () => GetFilterInvoiceQuery })
  filter!: GetFilterInvoiceQuery;

  @Expose()
  @IsOptional()
  @IsDateRange()
  @ApiPropertyOptional({ example: '2020-07-06_2022-07-06' })
  rangedate!: string;
}

@Exclude()
export class GetInvoiceQueryInStore extends OmitType(GetInvoiceQuery, ['filter'] as const) {
  @Expose()
  @ValidateNested()
  @IsOptional()
  @Type(() => GetFilterInvoiceQuery)
  @ApiPropertyOptional({ type: () => GetFilterInvoiceQuery })
  filter!: GetFilterInvoiceQuery;
}
