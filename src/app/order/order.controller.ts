import { AuthGuard } from '@app/auth/auth.guard';
import { StoreGuard } from '@app/auth/store.guard';
import { Body, Controller, Get, Param, ParseIntPipe, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';
import { CreateOrder, GetOrderQueryInStore } from 'src/schemas/order';
import { Order } from '@schemas';
import { OrderService } from './order.service';

@ApiBearerAuth('access-token')
@UseGuards(AuthGuard, StoreGuard)
@ApiTags('Orders')
@Controller(`store/:storeId/order`)
export class OrderStoreController {
  constructor(private readonly orderService: OrderService) {}

  @ApiOperation({ summary: 'Get Orders in store' })
  @ApiOkResponse({ type: [Order] })
  @Get('/')
  async getMany(
    @Param('storeId', ParseIntPipe) storeId: number,
    @Query() query: GetOrderQueryInStore,
  ) {
    const entities = await this.orderService.getMany({
      globalSearch: query.search,
      columnSearch: { ...query.filter },
      createdDateRange: query.rangedate ? query.rangedate.split('_') : null,
      storeId,
    });
    return entities.map(entity => plainToClass(Order, entity));
  }

  @ApiOperation({ description: 'Get Product data' })
  @ApiOkResponse({ type: Order })
  @Get('/:orderId')
  async get(@Param('orderId', ParseIntPipe) orderId: number): Promise<Order> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const entity = await this.orderService.getOrFail(orderId);
    return plainToClass(Order, entity);
  }

  @ApiConsumes('application/json')
  @ApiOperation({
    description: 'Create order',
  })
  @ApiOkResponse({ type: Order })
  @Post()
  async createOrder(@Param('storeId') storeId: number, @Body() body: CreateOrder): Promise<Order> {
    // eslint-disable-next-line no-console
    console.log(body);
    body.storeId = storeId;

    const entity = await this.orderService.createOrder(body);

    return plainToClass(Order, entity);
  }
}
