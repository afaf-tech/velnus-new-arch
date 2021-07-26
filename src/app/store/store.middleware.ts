import { NestMiddleware, Injectable, NotFoundException } from '@nestjs/common';
import { Request, Response } from '@common/http';
import { EntityNotFoundError } from 'typeorm/error/EntityNotFoundError';
import { ErrorBase } from '@common/exceptions';
import { StoreService } from './store.service';

@Injectable()
export class StoreMiddleware implements NestMiddleware<Request, Response> {
  constructor(private readonly storeService: StoreService) {}

  async use(req: Request, res: Response, next: () => void) {
    if (req.params.storeId) {
      try {
        res.locals.storeEntity = await this.storeService.repository.findOneOrFail(
          req.params.storeId,
        );
      } catch (error) {
        if (error instanceof EntityNotFoundError) {
          throw new NotFoundException(
            new ErrorBase(error, `Store #${req.params.storeId} doest not exits`),
          );
        }

        throw error;
      }
    }

    next();
  }
}
