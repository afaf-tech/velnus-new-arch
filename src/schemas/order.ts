import { orderColumnSearch, OrderStatusEnum } from '@app/order/order.constant';
import { OrderEntity } from '@app/order/order.entity';
import { PaymentMethodEnum, PaymentTypeEnum } from '@app/payment-method/payment-method-enum';
import { IsDateRange } from '@common/validators';
import { ApiProperty, ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';

export class Order {
  @Expose()
  @ApiProperty()
  id!: number;

  @Expose()
  @ApiProperty()
  orderNum!: number;

  @Expose()
  @ApiProperty()
  date: Date;

  @Expose()
  @ApiProperty()
  status: OrderStatusEnum;

  @Expose()
  @ApiProperty()
  notes: string;

  @Expose()
  @ApiProperty()
  amount: number;

  @Expose()
  @ApiProperty()
  storeId: number;
}
class CreateOrderProduct {
  @Expose()
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  id: number;

  @Expose()
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  qty: number;
}

// @Exclude()
export class CreateOrder {
  @Expose()
  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 0 })
  @ApiProperty({ description: 'customerId', type: Number })
  customerId: number;

  @Expose()
  @Type(() => String)
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Payment Method',
    default: PaymentMethodEnum.BankTransfer,
    enum: PaymentMethodEnum,
    enumName: 'PaymentMethodEnum',
  })
  paymentMethod: PaymentMethodEnum;

  @Expose()
  @Type(() => String)
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Payment Type',
    default: PaymentTypeEnum.ToManager,
    enum: PaymentMethodEnum,
    enumName: 'PaymentTypeEnum',
  })
  paymentType: string;

  @Expose()
  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'notes',
    example: 'notes',
  })
  notes: string;

  @Expose()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderProduct)
  @ApiProperty({ type: [CreateOrderProduct], default: [{ id: 1, qty: 12 }] })
  products: CreateOrderProduct[];

  storeId: number;
}
/**
 * Don't forget every place `GetFilterProductQuerty`, set in property `filter`!
 */
@Exclude()
export class GetFilterOrderQuery {
  @Expose()
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ name: 'filter[orderNum]' })
  orderNum!: string;

  @Expose()
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    name: 'filter[status]',
    description: Object.values(OrderStatusEnum).join(' | '),
    enum: OrderStatusEnum,
  })
  status!: string;
}

/**
 * Where colum allowing to search
 */
export type OrderColumnSearch = Pick<OrderEntity, 'orderNum' | 'status'>;

@Exclude()
export class GetOrderQuery {
  @Expose()
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: `Filter by ${orderColumnSearch.join(',')}` })
  search!: string;

  @Expose()
  @ValidateNested()
  @IsOptional()
  @Type(() => GetFilterOrderQuery)
  @ApiPropertyOptional({ type: () => GetFilterOrderQuery })
  filter!: GetFilterOrderQuery;

  @Expose()
  @IsOptional()
  @IsDateRange()
  @ApiPropertyOptional({ example: '2020-07-06_2022-07-06' })
  rangedate!: string;
}

@Exclude()
export class GetOrderQueryInStore extends OmitType(GetOrderQuery, ['filter'] as const) {
  @Expose()
  @ValidateNested()
  @IsOptional()
  @Type(() => GetFilterOrderQuery)
  @ApiPropertyOptional({ type: () => GetFilterOrderQuery })
  filter!: GetFilterOrderQuery;
}
