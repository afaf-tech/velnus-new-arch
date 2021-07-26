import { AuthGuard } from '@app/auth/auth.guard';
import {
  Get,
  Controller,
  UseGuards,
  Post,
  Body,
  Put,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Store, CreateStore, UpdateStore, GetStoreQuery } from '@schemas';
import { plainToClass } from 'class-transformer';
import { StoreService } from './store.service';

@ApiTags('Stores')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard)
@Controller('/store')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Get('/')
  @ApiOperation({ summary: 'Get stores' })
  @ApiOkResponse({ type: [Store] })
  async getMany(@Query() query: GetStoreQuery): Promise<Store[]> {
    const entities = await this.storeService.getMany({
      globalSearch: query.search,
      columnSearch: query.filter,
      dateRange: query.rangedate ? query.rangedate.split('_') : null,
    });
    return entities.map(entity => plainToClass(Store, entity));
  }

  @ApiConsumes('application/x-www-form-urlencoded')
  @ApiOperation({ description: 'Create new store' })
  @ApiOkResponse({ type: Store })
  @Post('/')
  async create(@Body() body: CreateStore): Promise<Store> {
    const entity = await this.storeService.create(body);
    if (!entity) return undefined;
    return plainToClass(Store, entity);
  }

  @ApiOperation({ description: 'Get store data' })
  @ApiOkResponse({ type: Store })
  @Get('/:storeId')
  async get(@Param('storeId', ParseIntPipe) storeId: number): Promise<Store> {
    const entity = await this.storeService.getOrFail(storeId);
    return plainToClass(Store, entity);
  }

  @ApiConsumes('application/x-www-form-urlencoded')
  @ApiOperation({ description: 'Update store data' })
  @ApiOkResponse({ type: Store })
  @Put('/:storeId')
  async update(
    @Param('storeId', ParseIntPipe) storeId: number,
    @Body() body: UpdateStore,
  ): Promise<Store> {
    const entity = await this.storeService.update(storeId, body);
    return plainToClass(Store, entity);
  }
}
