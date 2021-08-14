import { AuthGuard } from '@app/auth/auth.guard';
import { StoreGuard } from '@app/auth/store.guard';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';
import { CreateCustomer, Customer, GetCustomerQueryInStore, UpdateCustomerInStore } from '@schemas';
import { PermissionGuard } from '@app/auth/permission.guard';
import { Permission } from '@common/decorators/permission.decorator';
import { CustomerService } from './customer.service';

@ApiBearerAuth('access-token')
@UseGuards(AuthGuard, StoreGuard, PermissionGuard)
@ApiTags('Customers')
@Controller(`store/:storeId/customer`)
export class CustomerStoreController {
  constructor(private readonly customerService: CustomerService) {}

  @ApiOperation({ summary: 'Get Customers in store' })
  @ApiOkResponse({ type: [Customer] })
  @Permission('customer.listfa')
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

  @ApiOperation({ summary: 'Get customer data' })
  @ApiOkResponse({ type: Customer })
  @Get('/:customerId')
  async get(@Param('customerId', ParseIntPipe) customerId: number): Promise<Customer> {
    const entity = await this.customerService.getOrFail(customerId);
    return plainToClass(Customer, entity);
  }

  @ApiConsumes('application/x-www-form-urlencoded')
  @ApiOperation({
    summary: 'Create new Customer',
  })
  @ApiOkResponse({ type: Customer })
  @Permission('customer.create')
  @Post('/')
  async createProduct(
    @Param('storeId', ParseIntPipe) storeId: number,
    @Body() body: CreateCustomer,
  ): Promise<Customer> {
    body.storeId = storeId;
    const entity = await this.customerService.create(body);
    return plainToClass(Customer, entity);
  }

  @ApiConsumes('application/x-www-form-urlencoded')
  @ApiOperation({ summary: 'Update customer in store' })
  @ApiOkResponse({ type: Customer })
  @Permission('customer.update')
  @Put('/:customerId')
  async update(
    @Param('storeId', ParseIntPipe) storeId: number,
    @Param('customerId', ParseIntPipe) customerId: number,
    @Body() body: UpdateCustomerInStore,
  ) {
    body.storeId = storeId;
    const entity = await this.customerService.update(customerId, body);
    return plainToClass(Customer, entity);
  }

  @ApiOperation({ summary: 'Delete customer in store' })
  @Permission('customer.delete')
  @Delete('/:customerId')
  delete(@Param('storeId') storeId: number, @Param('customerId', ParseIntPipe) customerId: number) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.customerService.remove(customerId, { storeId });
  }
}
