import { InvoiceItemEntity } from '@app/invoice/invoice-item.entity';
import { InvoiceService } from '@app/invoice/invoice.service';
import { PaymentMethodEnum } from '@app/payment-method/payment-method-enum';
import { ProductService } from '@app/product/product.service';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateInvoiceItem } from '@schemas';
import { CreateOrder } from 'src/schemas/order';
import { Connection, Repository } from 'typeorm';
import { OrderStatusEnum } from './order.constant';
import { OrderEntity } from './order.entity';

export type ICreateOrder = Omit<OrderEntity, 'createdAt' | 'updatedAt' | 'store' | 'id'>;

@Injectable()
export class OrderService {
  constructor(
    private connection: Connection,
    @InjectRepository(OrderEntity) private readonly orderRepository: Repository<OrderEntity>,
    private readonly productService: ProductService,
    private readonly invoiceService: InvoiceService,
  ) {}

  async createOrder(data: CreateOrder): Promise<OrderEntity> {
    let totalAmount = 0;
    const timeNow = new Date();
    const invoiceItems = await Promise.all(
      data.products.map<Promise<InvoiceItemEntity>>(async product => {
        const productCheck = await this.productService.getOrFail(product.id, data.storeId);

        const total = productCheck.price * product.qty;
        totalAmount += total;
        const invoiceItemData: CreateInvoiceItem = {
          relId: productCheck.id,
          customerId: data.customerId,
          description: productCheck.name,
          amountEach: productCheck.cost,
          total,
          quantity: product.qty,
          dueDate: timeNow,
          notes: productCheck.name,
        };

        return this.invoiceService.invoiceItemRepo.create(invoiceItemData);
      }),
    );

    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    let orderSave: OrderEntity;
    try {
      const orderEntity = this.orderRepository.create({
        description: data.notes,
        notes: data.notes,
        orderNum: this.tenDigitNumber(),
        status: OrderStatusEnum.Pending,
        date: timeNow,
        storeId: data.storeId,
        paymentMethod: PaymentMethodEnum.BankTransfer,
      });

      orderSave = await queryRunner.manager.save(orderEntity);

      await this.invoiceService.create(
        {
          customerId: data.customerId,
          subtotal: totalAmount,
          total: totalAmount,
          status: 'UNPAID',
          orderId: orderSave.id,
          storeId: data.storeId,
          date: timeNow,
          dueDate: timeNow,
          notes: data.notes,
          invoiceItems,
        },
        queryRunner.manager,
      );
    } catch (error) {
      await queryRunner.commitTransaction();
      if (error) {
        throw error;
      }
    } finally {
      await queryRunner.release();
    }
    return orderSave;
  }

  /**
   *
   * @returns {number}
   */
  tenDigitNumber(): number {
    // const unique = new Date().valueOf();
    // return Number(String(unique).substring(3, 13));
    return Math.floor(1000000000 + Math.random() * 9000000000);
  }
}
