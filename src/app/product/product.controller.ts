import { AuthGuard } from '@app/auth/auth.guard';
import { StoreGuard } from '@app/auth/store.guard';
import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateProduct, Product } from '@schemas';
import { plainToClass } from 'class-transformer';
import { Request as HttpRequest } from '@common/http';
import { PermissionGuard } from '@app/auth/permission.guard';
import { Permission } from '@common/decorators/permission.decorator';
import { ProductService } from './product.service';

@ApiBearerAuth('access-token')
@UseGuards(AuthGuard, StoreGuard, PermissionGuard)
@ApiTags('Products')
@Controller(`store/:storeId/product`)
export class ProductStoreController {
  constructor(private readonly productService: ProductService) {}

  @Get('/')
  @Permission('product.list')
  async getMany(@Param('storeId', ParseIntPipe) storeId: number): Promise<Product[]> {
    const entities = await this.productService.getMany({ storeId });
    return entities.map(entity => plainToClass(Product, entity));
  }

  @ApiOperation({ description: 'Get Product data' })
  @ApiOkResponse({ type: Product })
  @Permission('product.get')
  @Get('/:productId')
  async get(@Param('productId', ParseIntPipe) productId: number): Promise<Product> {
    const entity = await this.productService.getOrFail(productId);
    return plainToClass(Product, entity);
  }

  @ApiConsumes('application/x-www-form-urlencoded')
  @ApiOperation({
    summary: 'Create new Product',
  })
  @Permission('product.create')
  @Post('/')
  async createProduct(
    @Param('storeId', ParseIntPipe) storeId: number,
    @Body() body: CreateProduct,
    @Request() req: HttpRequest,
  ): Promise<Product> {
    body.storeId = storeId;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    body.adminId = Number(req.user.account.id);
    const entity = await this.productService.create(body);
    return plainToClass(Product, entity);
  }
}
