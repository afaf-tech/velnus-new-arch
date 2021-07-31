import { AuthGuard } from '@app/auth/auth.guard';
import { StoreGuard } from '@app/auth/store.guard';
import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';
import { CreateOrder } from 'src/schemas/order';

@ApiBearerAuth('access-token')
@UseGuards(AuthGuard, StoreGuard)
@ApiTags('Orders')
@Controller(`store/:storeId/order`)
export class OrderStoreController {
  constructor() {}

  @ApiConsumes('application/x-www-form-urlencoded')
  @ApiOperation({
    description: 'Create order',
  })
  @Post()
  async createOrder(@Param('storeId') storeId: number, @Body() body: CreateOrder): Promise<any> {
    console.log(body);

    // const order = await this.
    // const entity()

    // return plainToClass(Order, entity);
  }
}
