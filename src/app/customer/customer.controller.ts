import { AuthGuard } from '@app/auth/auth.guard';
import { StoreGuard } from '@app/auth/store.guard';
import { Body, Controller, Get, Param, ParseIntPipe, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';
import { CreateCustomer, Customer, GetCustomerQueryInStore } from '@schemas';
import { CustomerService } from './customer.service';

@ApiBearerAuth('access-token')
@UseGuards(AuthGuard, StoreGuard)
@ApiTags('Customers')
@Controller(`store/:storeId/customer`)
export class CustomerStoreController {
  constructor(private readonly customerService: CustomerService) {}

  @ApiOperation({ summary: 'Get Customers in store' })
  @ApiOkResponse({ type: [Customer] })
  @Get('/')
  async getMany(
    @Param('storeId', ParseIntPipe) storeId: number,
    @Query() query: GetCustomerQueryInStore,
  ) {
    const entities = await this.customerService.getMany({
      globalSearch: query.search,
      columnSearch: { ...query.filter, storeId },
      dateRange: query.rangedate ? query.rangedate.split('_') : null,
    });
    return entities.map(entity => plainToClass(Customer, entity));
  }

  @ApiOperation({ description: 'Get customer data' })
  @ApiOkResponse({ type: Customer })
  @Get('/:customerId')
  async get(@Param('customerId', ParseIntPipe) customerId: number): Promise<Customer> {
    const entity = await this.customerService.getOrFail(customerId);
    return plainToClass(Customer, entity);
  }

  @ApiConsumes('application/x-www-form-urlencoded')
  @ApiOperation({
    description: 'Create new material item',
  })
  @ApiOkResponse({ type: Customer })
  @Post('/')
  async createProduct(
    @Param('storeId', ParseIntPipe) storeId: number,
    @Body() body: CreateCustomer,
  ): Promise<Customer> {
    body.storeId = storeId;
    const entity = await this.customerService.create(body);
    return plainToClass(Customer, entity);
  }
}
