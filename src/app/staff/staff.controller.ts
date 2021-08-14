import { AuthGuard } from '@app/auth/auth.guard';
import { PermissionGuard } from '@app/auth/permission.guard';
import { StoreGuard } from '@app/auth/store.guard';
import { Permission } from '@common/decorators/permission.decorator';
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
import {
  CreateStaff,
  CreateStaffInStore,
  GetStaffQuery,
  GetStaffQueryInStore,
  Staff,
  UpdateStaff,
  UpdateStaffInStore,
} from '@schemas';
import { plainToClass } from 'class-transformer';
import { StaffService } from './staff.service';

@ApiTags('Staffs')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard)
@Controller('/staff')
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @ApiOperation({ summary: 'Get staffs' })
  @ApiOkResponse({ type: [Staff] })
  @Get('/')
  async getMany(@Query() query: GetStaffQuery) {
    const entities = await this.staffService.getMany({
      globalSearch: query.search,
      columnSearch: query.filter,
      dateRange: query.rangedate ? query.rangedate.split('_') : null,
    });
    return entities.map(entity => plainToClass(Staff, entity));
  }

  @ApiConsumes('application/x-www-form-urlencoded')
  @ApiOperation({ summary: 'Create new staff' })
  @ApiOkResponse({ type: Staff })
  @Post('/')
  async create(@Body() body: CreateStaff) {
    const entity = await this.staffService.create(body);
    return plainToClass(Staff, entity);
  }

  @ApiOperation({ summary: 'Get staff data' })
  @ApiOkResponse({ type: Staff })
  @Get('/:staffId')
  async get(@Param('staffId') staffId: number) {
    const entity = await this.staffService.getOrFail(staffId);
    return plainToClass(Staff, entity);
  }

  @ApiConsumes('application/x-www-form-urlencoded')
  @ApiOperation({ summary: 'Update staff' })
  @ApiOkResponse({ type: Staff })
  @Put('/:staffId')
  async update(@Param('staffId', ParseIntPipe) staffId: number, @Body() body: UpdateStaff) {
    const entity = await this.staffService.update(staffId, body);
    return plainToClass(Staff, entity);
  }

  @ApiOperation({ summary: 'Delete staff' })
  @Delete('/:staffId')
  delete(@Param('staffId', ParseIntPipe) staffId: number) {
    return this.staffService.delete(staffId);
  }
}

@ApiTags('Staffs')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard, StoreGuard, PermissionGuard)
@Controller('/store/:storeId/staff')
export class StaffInStoreController {
  constructor(private readonly staffService: StaffService) {}

  @ApiOperation({ summary: 'Get staffs in store' })
  @ApiOkResponse({ type: [Staff] })
  @Permission('staff.list')
  @Get('/')
  async getMany(
    @Param('storeId', ParseIntPipe) storeId: number,
    @Query() query: GetStaffQueryInStore,
  ) {
    const entities = await this.staffService.getMany({
      globalSearch: query.search,
      columnSearch: { ...query.filter, storeId },
      dateRange: query.rangedate ? query.rangedate.split('_') : null,
    });
    return entities.map(entity => plainToClass(Staff, entity));
  }

  @ApiConsumes('application/x-www-form-urlencoded')
  @ApiOperation({ summary: 'Create new staff in store' })
  @ApiOkResponse({ type: Staff })
  @Permission('staff.create')
  @Post('/')
  async create(@Param('storeId') storeId: number, @Body() body: CreateStaffInStore) {
    const entity = await this.staffService.create({ ...body, storeId }, { storeId });
    return plainToClass(Staff, entity);
  }

  @ApiOperation({ summary: 'Get staff in store' })
  @ApiOkResponse({ type: Staff })
  @Get('/:staffId')
  @Permission('staff.get')
  async get(
    @Param('storeId', ParseIntPipe) storeId: number,
    @Param('staffId', ParseIntPipe) staffId: number,
  ) {
    const entity = await this.staffService.getOrFail(staffId, { storeId });
    return plainToClass(Staff, entity);
  }

  @ApiConsumes('application/x-www-form-urlencoded')
  @ApiOperation({ summary: 'Update staff in store' })
  @ApiOkResponse({ type: Staff })
  @Permission('staff.update')
  @Put('/:staffId')
  async update(
    @Param('storeId', ParseIntPipe) storeId: number,
    @Param('staffId', ParseIntPipe) staffId: number,
    @Body() body: UpdateStaffInStore,
  ) {
    const entity = await this.staffService.update(staffId, body, { storeId });
    return plainToClass(Staff, entity);
  }

  @ApiOperation({ summary: 'Delete staff in store' })
  @Permission('staff.delete')
  @Delete('/:staffId')
  delete(@Param('storeId') storeId: number, @Param('staffId', ParseIntPipe) staffId: number) {
    return this.staffService.delete(staffId, { storeId });
  }
}
