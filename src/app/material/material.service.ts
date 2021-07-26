import { Injectable, NotFoundException } from '@nestjs/common';
import { Brackets, DeleteResult, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateMaterial, GetFilterMaterialQuery } from '@schemas';
import { isEmpty } from 'lodash';
import { endOfDay, parseISO, startOfDay } from 'date-fns';
import { ErrorBase } from '@common/exceptions';
import { MaterialEntity } from './material.entity';
import { UpdateMaterialDto } from './material.dto';

export interface GetMaterialOptions {
  fail?: boolean;
  storeId?: number;
}

export interface GetManyMaterialOptions extends GetMaterialOptions {
  globalSearch?: string;
  columnSearch?: { [x in keyof GetFilterMaterialQuery]: string };
  createdDateRange?: string[];
}

@Injectable()
export class MaterialService {
  constructor(
    @InjectRepository(MaterialEntity)
    private readonly materialRepository: Repository<MaterialEntity>,
  ) {}

  get repository(): Repository<MaterialEntity> {
    return this.materialRepository;
  }

  async get(
    materialId: number,
    options: GetMaterialOptions = {},
  ): Promise<MaterialEntity | undefined> {
    const query = this.materialRepository.createQueryBuilder('material');

    query.where('material.id = :materialId', { materialId });

    if (options.storeId) {
      query.innerJoin('material.products', 'product');
      query.where('material.product.storeId = :storeId', { storeId: options.storeId });
    }

    const entity = await query.getOne();

    if (options?.fail === true && !entity) {
      throw new NotFoundException(
        new ErrorBase('Ups... Someting was wrong', {
          devMessage: `Store #${materialId} doest not exist`,
        }),
      );
    }

    return entity;
  }

  getMany(options: GetManyMaterialOptions = {}): Promise<MaterialEntity[]> {
    const query = this.materialRepository.createQueryBuilder('material');

    if (options.storeId) {
      query.innerJoin('material.products', 'product');
      query.where('material.product.storeId = :storeId', { storeId: options.storeId });
    }

    if (options?.columnSearch) {
      query.andWhere(
        new Brackets(qb => {
          // eslint-disable-next-line no-restricted-syntax
          for (const [key, value] of Object.entries(options.columnSearch)) {
            if (!isEmpty(value)) {
              qb.andWhere(`material.${key} = :value`, { key, value });
            }
          }
        }),
      );
    }

    if (!isEmpty(options?.globalSearch)) {
      query.andWhere(
        new Brackets(qb => {
          qb.where('material.name LIKE :name', { name: `%${options.globalSearch}%` }).orWhere(
            'material.description LIKE :address',
            { address: `%${options.globalSearch}%` },
          );
        }),
      );
    }

    if (options?.createdDateRange && options?.createdDateRange.length) {
      const range = options.createdDateRange;
      const startDate = startOfDay(parseISO(range[0]));
      const endDate = endOfDay(parseISO(range[1]));

      query.andWhere('material.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate });
    }

    return query.getMany();
  }

  create(data: CreateMaterial): Promise<MaterialEntity> {
    const entity = this.materialRepository.create();
    Object.assign(entity, { ...{ id: undefined, name: undefined, ...data } });
    return this.materialRepository.save(entity);
  }

  async update(materialId: number, data: UpdateMaterialDto): Promise<MaterialEntity> {
    const entity = await this.get(materialId);
    Object.assign(entity, data);
    return this.materialRepository.save({ ...entity, data });
  }

  async delete(materialId: number): Promise<DeleteResult> {
    return this.materialRepository.delete(materialId);
  }
}
