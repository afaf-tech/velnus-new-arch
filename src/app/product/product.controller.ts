import { AuthGuard } from '@app/auth/auth.guard';
import { StoreGuard } from '@app/auth/store.guard';
import { Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateProduct, Product } from '@schemas';
import { plainToClass } from 'class-transformer';
import { ProductService } from './product.service';

@ApiBearerAuth('access-token')
@UseGuards(AuthGuard, StoreGuard)
@ApiTags('Products')
@Controller(`store/:storeId/product`)
export class ProductStoreController {
  constructor(private readonly productService: ProductService) {}

  @Get('/')
  async getMany(@Param('storeId', ParseIntPipe) storeId: number): Promise<Product[]> {
    const entities = await this.productService.getMany({ storeId });
    return entities.map(entity => plainToClass(Product, entity));
  }

  @ApiOperation({ description: 'Get store data' })
  @ApiOkResponse({ type: Product })
  @Get('/:productId')
  async get(@Param('productId', ParseIntPipe) productId: number): Promise<Product> {
    const entity = await this.productService.getOrFail(productId);
    return plainToClass(Product, entity);
  }

  @ApiConsumes('application/x-www-form-urlencoded')
  @ApiOperation({
    description: 'Create new material item',
  })
  @Post('/')
  async createProduct(
    @Param('storeId', ParseIntPipe) storeId: number,
    @Body() body: CreateProduct,
  ): Promise<Product> {
    body.storeId = storeId;
    const entity = await this.productService.create(body);
    return plainToClass(Product, entity);
  }
}
