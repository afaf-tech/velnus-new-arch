import { AuthGuard } from '@app/auth/auth.guard';
import { StoreGuard } from '@app/auth/store.guard';
import { UseGuards, Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiOkResponse } from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';
import { GetInvoiceQueryInStore, Invoice } from 'src/schemas/invoice';
import { InvoiceService } from './invoice.service';

@ApiBearerAuth('access-token')
@UseGuards(AuthGuard, StoreGuard)
@ApiTags('Orders')
@Controller(`store/:storeId/invoice`)
export class InvioceStoreController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @ApiOperation({ summary: 'Get Invoice in store' })
  @ApiOkResponse({ type: [Invoice] })
  @Get('/')
  async getMany(
    @Param('storeId', ParseIntPipe) storeId: number,
    @Query() query: GetInvoiceQueryInStore,
  ) {
    const entities = await this.invoiceService.getMany({
      globalSearch: query.search,
      columnSearch: { ...query.filter },
      createdDateRange: query.rangedate ? query.rangedate.split('_') : null,
      storeId,
    });
    return entities.map(entity => plainToClass(Invoice, entity));
  }

  @ApiOperation({ description: 'Get invoice data' })
  @ApiOkResponse({ type: Invoice })
  @Get('/:invoiceId')
  async get(@Param('invoiceId', ParseIntPipe) invoiceId: number): Promise<Invoice> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const entity = await this.invoiceService.getOrFail(invoiceId);
    return plainToClass(Invoice, entity);
  }
}
