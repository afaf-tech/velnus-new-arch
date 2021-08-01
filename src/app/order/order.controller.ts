import { AuthGuard } from '@app/auth/auth.guard';
import { StoreGuard } from '@app/auth/store.guard';
import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';
import { CreateOrder } from 'src/schemas/order';
import { Order } from '@schemas';
import { OrderService } from './order.service';

@ApiBearerAuth('access-token')
@UseGuards(AuthGuard, StoreGuard)
@ApiTags('Orders')
@Controller(`store/:storeId/order`)
export class OrderStoreController {
  constructor(private readonly orderService: OrderService) {}

  @ApiConsumes('application/json')
  @ApiOperation({
    description: 'Create order',
  })
  @ApiOkResponse({ type: Order })
  @Post()
  async createOrder(@Param('storeId') storeId: number, @Body() body: CreateOrder): Promise<Order> {
    // eslint-disable-next-line no-console
    console.log(body);

    const entity = await this.orderService.createOrder(body);

    return plainToClass(Order, entity);
  }
}
