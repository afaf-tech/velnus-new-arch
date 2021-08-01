import { OrderStatusEnum } from '@app/order/order.constant';
import { PaymentMethodEnum, PaymentTypeEnum } from '@app/payment-method/payment-method-enum';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Exclude, Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator';

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
