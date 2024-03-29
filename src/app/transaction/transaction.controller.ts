import { AuthGuard } from '@app/auth/auth.guard';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';
import { CreateTransaction, GetTransactionQuery, PayTransactionOrder, Transaction } from '@schemas';
import { Request as HttpRequest } from '@common/http';
import { StoreGuard } from '@app/auth/store.guard';
import { GetManyTransactionOptions, TransactionService } from './transaction.service';

@ApiTags('Transactions')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard)
@Controller('/transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get('/')
  async getMany(@Query() query: GetTransactionQuery): Promise<Transaction[]> {
    const options: GetManyTransactionOptions = {
      globalSearch: query.search,
      columnSearch: query.filter,
      createdDateRange: query.rangedate ? query.rangedate.split('_') : null,
    };
    const entities = await this.transactionService.getMany(options);
    return entities.map(entity => plainToClass(Transaction, entity));
  }

  @Post('/')
  async create(@Body() body: CreateTransaction): Promise<Transaction> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const entity = await this.transactionService.create(body);
    return plainToClass(Transaction, entity);
  }

  @Get('/:transactionId')
  async get(@Param('transactionId', ParseIntPipe) transactionId: number): Promise<Transaction> {
    const entity = await this.transactionService.get(transactionId, { fail: true });
    return plainToClass(Transaction, entity);
  }

  @Delete('/:transactionId')
  delete(@Param('transactionId') transactionId: number) {
    return this.transactionService.delete(transactionId);
  }
}

@ApiTags('Transactions')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard, StoreGuard)
@Controller('/:storeId/transaction')
export class TransactionInStoreController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get('/')
  async getMany(
    @Param('storeId', ParseIntPipe) storeId: number,
    @Query() query: GetTransactionQuery,
  ): Promise<Transaction[]> {
    const options: GetManyTransactionOptions = {
      globalSearch: query.search,
      columnSearch: query.filter,
      createdDateRange: query.rangedate ? query.rangedate.split('_') : null,
      storeId,
    };
    const entities = await this.transactionService.getMany(options);
    return entities.map(entity => plainToClass(Transaction, entity));
  }

  @Get('/:transactionId')
  async get(
    @Param('storeId', ParseIntPipe) storeId: number,
    @Param('transactionId', ParseIntPipe) transactionId: number,
  ): Promise<Transaction> {
    const entity = await this.transactionService.get(transactionId, { fail: true, storeId });
    return plainToClass(Transaction, entity);
  }

  @ApiConsumes('application/x-www-form-urlencoded')
  @ApiOperation({
    summary: 'Transaction Order',
  })
  @Post('/')
  async create(
    @Param('storeId', ParseIntPipe) storeId: number,
    @Body() body: PayTransactionOrder,
    @Request() req: HttpRequest,
  ): Promise<Transaction> {
    body.staffId = Number(req.user.account.id);
    body.storeId = storeId;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const entity = await this.transactionService.payTransactionOrder(body);
    return plainToClass(Transaction, entity);
  }

  @Delete('/:transactionId')
  async delete(@Param('transactionId', ParseIntPipe) transactionId: number) {
    return this.transactionService.delete(transactionId);
  }
}
