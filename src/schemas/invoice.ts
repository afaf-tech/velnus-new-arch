import { OmitType } from '@nestjs/mapped-types';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

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

export class CreateInvoiceInStore extends OmitType(CreateInvoice, ['storeId']) {}
