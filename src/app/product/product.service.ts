import { CreditService } from '@app/credit/credit.service';
import { MaterialService } from '@app/material/material.service';
import { ErrorBase } from '@common/exceptions';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProduct, GetFilterProductQuery } from '@schemas';
import { endOfDay, parseISO, startOfDay } from 'date-fns';
import { isEmpty } from 'lodash';
import { Brackets, Connection, EntityNotFoundError, FindOneOptions, Repository } from 'typeorm';
import { ProductEntity } from './product.entity';

export interface GetProductOptions {
  fail?: boolean;
  storeId?: number;
}
export interface GetManyProductOptions extends GetProductOptions {
  globalSearch?: string;
  columnSearch?: { [x in keyof GetFilterProductQuery]: string };
  createdDateRange?: string[];
}
@Injectable()
export class ProductService {
  constructor(
    private connection: Connection,
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    private materialService: MaterialService,
    private creditService: CreditService,
  ) {}

  get repository(): Repository<ProductEntity> {
    return this.productRepository;
  }

  getMany(options: GetManyProductOptions = {}): Promise<ProductEntity[]> {
    const query = this.productRepository.createQueryBuilder('product');

    if (options.storeId) {
      query.leftJoinAndSelect('product.materials', 'material');
      query.where('product.storeId = :storeId', { storeId: options.storeId });
    }

    if (options?.columnSearch) {
      query.andWhere(
        new Brackets(qb => {
          // eslint-disable-next-line no-restricted-syntax
          for (const [key, value] of Object.entries(options.columnSearch)) {
            if (!isEmpty(value)) {
              qb.andWhere(`product.${key} = :value`, { key, value });
            }
          }
        }),
      );
    }

    if (!isEmpty(options?.globalSearch)) {
      query.andWhere(
        new Brackets(qb => {
          qb.where('product.name LIKE :name', { name: `%${options.globalSearch}%` }).orWhere(
            'product.description LIKE :address',
            { address: `%${options.globalSearch}%` },
          );
        }),
      );
    }

    if (options?.createdDateRange && options?.createdDateRange.length) {
      const range = options.createdDateRange;
      const startDate = startOfDay(parseISO(range[0]));
      const endDate = endOfDay(parseISO(range[1]));

      query.andWhere('product.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate });
    }

    return query.getMany();
  }

  getOrFail(productId: number, storeId?: number): Promise<ProductEntity> {
    let param = {};
    if (storeId) {
      param = { id: productId, storeId };
    } else {
      param = { id: productId };
    }
    const queries: FindOneOptions<ProductEntity> = {
      where: param,
      relations: ['materials'],
    };

    try {
      return this.productRepository.findOneOrFail(queries);
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw new NotFoundException(
          new ErrorBase('Ups... Someting was wrong', {
            devMessage: `Store #${productId} doest not exist`,
          }),
        );
      } else {
        throw error;
      }
    }
  }

  async create(data: CreateProduct): Promise<ProductEntity> {
    const materials = await this.materialService.getByIds(
      data.materialids.map<number>(e => Number(e)),
    );
    const costFromVelnus = materials.reduce<number>((acc, curr) => {
      return acc + curr.cost;
    }, 0);

    // cek price from manager must be greater than or equal to cost from all materials
    if (data.price < costFromVelnus) {
      // price will be used when deposite plus
      throw new ConflictException(
        new ErrorBase('price must be greater than or equal to total of product materials used.'),
      );
    }

    // fee is 10% profit for velnus from total materials each product.
    const fee = (costFromVelnus * 10) / 100; // from total cost

    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    let productSave: ProductEntity;
    try {
      const entity = this.productRepository.create({
        storeId: data.storeId,
        name: data.name,
        description: data.description,
        cost: costFromVelnus,
        price: data.price,
        stock: data.stock,
        fee,
        materials,
      });
      productSave = await queryRunner.manager.save(entity);
      // delegate deposite
      const totalDeposite = costFromVelnus * data.stock + fee * data.stock;
      await this.creditService.create(
        {
          description: `create ${data.stock} product ${data.name}`,
          total: -totalDeposite,
          storeId: data.storeId,
          adminId: 1,
          productId: productSave.id,
        },
        { entityManager: queryRunner.manager },
      );
      await queryRunner.commitTransaction();

      return productSave;
    } catch (error) {
      if (error) {
        throw error;
      }
    } finally {
      await queryRunner.release();
    }

    return productSave;
  }
}
