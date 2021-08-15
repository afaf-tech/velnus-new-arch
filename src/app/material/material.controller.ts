/* eslint-disable max-classes-per-file */

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
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateMaterial, GetMaterialQuery, Material } from '@schemas';
import { plainToClass } from 'class-transformer';
import { GetManyMaterialOptions, MaterialService } from './material.service';

@ApiTags('Materials')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard)
@Controller(`/material`)
export class MaterialController {
  constructor(private readonly materialService: MaterialService) {}

  @ApiOperation({ description: 'Get material list' })
  @ApiOkResponse({ type: [Material] })
  @Get('/')
  async getMany(@Query() query: GetMaterialQuery): Promise<Material[]> {
    const options: GetManyMaterialOptions = {
      globalSearch: query.search,
      columnSearch: query.filter,
      createdDateRange: query.rangedate ? query.rangedate.split('_') : null,
    };
    const entities = await this.materialService.getMany(options);
    return entities.map(entity => plainToClass(Material, entity));
  }

  @Get('/:materialId')
  async getOne(@Param('materialId', ParseIntPipe) materialId: number): Promise<Material> {
    const entity = await this.materialService.get(materialId, { fail: true });
    return plainToClass(Material, entity);
  }

  @ApiConsumes('application/x-www-form-urlencoded')
  @ApiOperation({ description: 'Create new material item' })
  @ApiOkResponse({ type: Material })
  @Post('/')
  async create(@Body() body: CreateMaterial): Promise<Material> {
    const entity = await this.materialService.create(body);
    return plainToClass(Material, entity);
  }

  @Delete('/:materialId')
  detele(@Param('materialId', ParseIntPipe) materialId: number) {
    return this.materialService.delete(materialId);
  }
}

@ApiBearerAuth('access-token')
@UseGuards(AuthGuard, StoreGuard, PermissionGuard)
@ApiTags('Materials')
@Controller('store/:storeId/material')
export class MaterialStoreController {
  constructor(private readonly materialService: MaterialService) {}

  @ApiOperation({ description: 'Get store material list' })
  @ApiOkResponse({ type: [Material] })
  @Permission('material.list')
  @Get('/')
  async getMany(
    @Param('storeId', ParseIntPipe) storeId: number,
    @Query() query: GetMaterialQuery,
  ): Promise<Material[]> {
    const options: GetManyMaterialOptions = {
      globalSearch: query.search,
      columnSearch: query.filter,
      createdDateRange: query.rangedate ? query.rangedate.split('_') : null,
      storeId,
    };
    const entities = await this.materialService.getMany(options);
    return entities.map(entity => plainToClass(Material, entity));
  }

  @Permission('material.get')
  @Get('/:materialId')
  async getOne(
    @Param('storeId', ParseIntPipe) storeId: number,
    @Param('materialId', ParseIntPipe) materialId: number,
  ): Promise<Material> {
    const entity = await this.materialService.get(materialId, { fail: true });
    return plainToClass(Material, entity);
  }
}
