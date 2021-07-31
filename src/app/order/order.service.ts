import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateOrder } from 'src/schemas/order';
import { Repository } from 'typeorm';
import { OrderEntity } from './order.entity';

@Injectable()
export class OrderService {
  constructor(@InjectRepository(OrderEntity) private readonly orderRepository: Repository<OrderEntity>) {}

  async createOrder(data: CreateOrder) {
    const order = this.orderRepository.create(data);

    
  }
}
