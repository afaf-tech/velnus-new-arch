import { PaymentMethodEnum } from '@app/payment-method/payment-method-enum';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Exclude, Type, Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator';

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

@Exclude()
export class CreateOrder {
  @Expose()
  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  @ApiProperty({ description: 'customerId', type: Number })
  customerId: number;

  @Expose()
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Payment Method',
    default: PaymentMethodEnum.BankTransfer,
    enum: PaymentMethodEnum,
    enumName: 'PaymentMethodEnum',
  })
  paymentMethod: PaymentMethodEnum;

  paymentType: string;

  @Expose()
  @Transform(({ value }) => {
    console.log(value);
    console.log(typeof value);
  })
  @ValidateNested({ each: true })
  @Type(() => CreateOrderProduct)
  @ApiProperty({ type: [CreateOrderProduct], default: [{ id: 1, qty: 12 }] })
  products: CreateOrderProduct[];
}
