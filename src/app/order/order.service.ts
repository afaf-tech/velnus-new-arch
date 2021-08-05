import { InvoiceItemEntity } from '@app/invoice/invoice-item.entity';
import { InvoiceStatusEnum } from '@app/invoice/invoice.constant';
import { InvoiceService } from '@app/invoice/invoice.service';
import { PaymentMethodEnum } from '@app/payment-method/payment-method-enum';
import { ProductService } from '@app/product/product.service';
import { ErrorBase } from '@common/exceptions';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateInvoiceItem } from '@schemas';
import { isNotEmpty } from 'class-validator';
import { endOfDay, parseISO, startOfDay } from 'date-fns';
import { isEmpty } from 'lodash';
import { CreateOrder, OrderColumnSearch } from 'src/schemas/order';
import { Brackets, Connection, EntityNotFoundError, FindOneOptions, Repository } from 'typeorm';
import { OrderStatusEnum } from './order.constant';
import { OrderEntity } from './order.entity';

export type ICreateOrder = Omit<OrderEntity, 'createdAt' | 'updatedAt' | 'store' | 'id'>;

export interface GetOrderOptions {
  fail?: boolean;
  storeId?: number;
}
export interface GetManyOrderOptions extends GetOrderOptions {
  globalSearch?: string;
  columnSearch?: { [x in keyof OrderColumnSearch]: string };
  createdDateRange?: string[];
}

@Injectable()
export class OrderService {
  constructor(
    private connection: Connection,
    @InjectRepository(OrderEntity) private readonly orderRepository: Repository<OrderEntity>,
    private readonly productService: ProductService,
    private readonly invoiceService: InvoiceService,
  ) {}

  getMany(options: GetManyOrderOptions = {}): Promise<OrderEntity[]> {
    const query = this.orderRepository.createQueryBuilder('order');

    if (options.storeId) {
      query.where('order.storeId = :storeId', { storeId: options.storeId });
    }

    if (options?.columnSearch) {
      query.andWhere(
        new Brackets(qb => {
          // eslint-disable-next-line no-restricted-syntax
          for (const [key, value] of Object.entries(options.columnSearch)) {
            if (!isNotEmpty(value)) {
              qb.andWhere(`order.${key} = :value`, { key, value });
            }
          }
        }),
      );
    }

    if (!isEmpty(options?.globalSearch)) {
      query.andWhere(
        new Brackets(qb => {
          qb.where('order.name LIKE :orderNum', { orderNum: `%${options.globalSearch}%` });
        }),
      );
    }

    if (options?.createdDateRange && options?.createdDateRange.length) {
      const range = options.createdDateRange;
      const startDate = startOfDay(parseISO(range[0]));
      const endDate = endOfDay(parseISO(range[1]));

      query.andWhere('order.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate });
    }

    return query.getMany();
  }

  getOrFail(orderId: number, storeId?: number): Promise<OrderEntity> {
    let param = {};
    if (storeId) {
      param = { id: orderId, storeId };
    } else {
      param = { id: orderId };
    }
    const queries: FindOneOptions<OrderEntity> = {
      where: param,
      relations: ['invoice'],
    };

    try {
      return this.orderRepository.findOneOrFail(queries);
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw new NotFoundException(
          new ErrorBase('Ups... Someting was wrong', {
            devMessage: `Store #${orderId} doest not exist`,
          }),
        );
      } else {
        throw error;
      }
    }
  }

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
          status: InvoiceStatusEnum.Unpaid,
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
