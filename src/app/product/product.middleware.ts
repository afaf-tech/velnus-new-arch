import { NestMiddleware, Injectable, NotFoundException } from '@nestjs/common';
import { Request, Response } from '@common/http';
import { EntityNotFoundError } from 'typeorm/error/EntityNotFoundError';
import { ErrorBase } from '@common/exceptions';
import { ProductService } from './product.service';

@Injectable()
export class ProductMiddleware implements NestMiddleware<Request, Response> {
  constructor(private readonly productService: ProductService) {}

  async use(req: Request, res: Response, next: () => void) {
    if (req.params.storeId) {
      try {
        const productEntity = await this.productService.repository.findOneOrFail(
          req.params.productId,
        );

        // set to res.locals
        res.locals.productEntity = productEntity;
      } catch (error) {
        if (error instanceof EntityNotFoundError) {
          throw new NotFoundException(
            new ErrorBase(error, `Product #${req.params.productId} doest not exits`),
          );
        }

        throw error;
      }
    }

    next();
  }
}
