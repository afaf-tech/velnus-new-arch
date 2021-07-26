import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DeleteResult,
  EntityNotFoundError,
  FindConditions,
  FindOneOptions,
  Repository,
} from 'typeorm';
import { WithPaginationOptions, WithPaginationResult } from '@common/interfaces';
import { ErrorBase } from '@common/exceptions';
import { isEmpty, omitBy } from 'lodash';
import { SearchQuery } from '@common/database';
import { StoreEntity } from './store.entity';
import {
  ICreateStore,
  IUpdateStore,
  StoreServiceCreateOptions,
  StoreServiceDeleteOptions,
  StoreServiceGetManyOptions,
  StoreServiceUpdateOptions,
} from './store.interface';
import { storeColumnSearch } from './store.constants';

// NOTE: ini cuma kalkulasi pagination, cuma masih aku simpen aja xd
// const getRange = (start: number, end: number) => Array(end - start + 1).map((v, i) => i + start);

// TODO: use after to do ...
// // eslint-disable-next-line @typescript-eslint/no-unused-vars
// const pagination = (currentPage: number, pageCount: number) => {
//   let delta: number;

//   if (pageCount <= 7) {
//     // delta === 7: [1 2 3 4 5 6 7]
//     delta = 7;
//   } else {
//     // delta === 2: [1 ... 4 5 6 ... 10]
//     // delta === 4: [1 2 3 4 5 ... 10]
//     delta = currentPage > 4 && currentPage < pageCount - 3 ? 2 : 4;
//   }

//   const range = {
//     start: Math.round(currentPage - delta / 2),
//     end: Math.round(currentPage + delta / 2),
//   };

//   if (range.start - 1 === 1 || range.end + 1 === pageCount) {
//     range.start += 1;
//     range.end += 1;
//   }

//   let pages: (number | string)[] =
//     currentPage > delta
//       ? getRange(Math.min(range.start, pageCount - delta), Math.min(range.end, pageCount))
//       : getRange(1, Math.min(pageCount, delta + 1));

//   const withDots = (value: number, pair: (number | string)[]): (number | string)[] =>
//     pages.length + 1 !== pageCount ? pair : [value];

//   if (pages[0] !== 1) {
//     pages = withDots(1, [1, '...']).concat(pages);
//   }

//   if (pages[pages.length - 1] < pageCount) {
//     pages = pages.concat(withDots(pageCount, ['...', pageCount]));
//   }

//   return pages;
// };

@Injectable()
export class StoreService {
  constructor(
    @InjectRepository(StoreEntity)
    private readonly storeRepository: Repository<StoreEntity>,
  ) {}

  get repository(): Repository<StoreEntity> {
    return this.storeRepository;
  }

  get(storeId: number): Promise<StoreEntity> {
    const where: FindConditions<StoreEntity> = { id: storeId };
    const queries: FindOneOptions<StoreEntity> = { where };
    return this.storeRepository.findOne(queries);
  }

  getOrFail(storeId: number): Promise<StoreEntity> {
    const queries: FindOneOptions<StoreEntity> = { where: { storeId } };

    try {
      return this.storeRepository.findOneOrFail(queries);
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw new NotFoundException(
          new ErrorBase('Ups... Someting was wrong', {
            devMessage: `Store #${storeId} doest not exist`,
          }),
        );
      } else {
        throw error;
      }
    }
  }

  getMany(options: StoreServiceGetManyOptions = {}): Promise<StoreEntity[]> {
    const { metadata: meta } = this.storeRepository;
    const query = this.storeRepository.createQueryBuilder(meta.tableName);

    const searchQuery = new SearchQuery(this.repository, query);
    searchQuery.search(storeColumnSearch, options.globalSearch);
    searchQuery.filter(options.columnSearch);
    searchQuery.dateRange('createdAt', options.dateRange);

    return query.getMany();
  }

  async getManyWithPagination(
    params?: WithPaginationOptions,
  ): Promise<WithPaginationResult<StoreEntity>> {
    let { page = 1, limit = 10 } = params || {};

    if (!page) page = 1;
    if (page < 1) page = 1;
    if (!limit) limit = 1;
    if (limit < 1) limit = 1;

    const offset = limit * (page - 1);
    const total = await this.storeRepository.count();
    const pages = Math.ceil(total / limit);

    const entities = await this.storeRepository.find({
      skip: offset,
      take: limit,
    });

    return {
      data: entities,
      total,
      page: {
        limit,
        current: page,
        total: pages,
      },
    };
  }

  create(data: ICreateStore, options: StoreServiceCreateOptions = {}): Promise<StoreEntity> {
    const entity = this.storeRepository.create();
    // Solve object key ordering issues
    const insert = { id: undefined, name: undefined, address: undefined, ...data };
    Object.assign(entity, insert);

    if (options?.entityManager) {
      return options.entityManager.save(StoreEntity, entity);
    }

    return this.storeRepository.save(entity);
  }

  async update(
    storeId: number,
    data: IUpdateStore,
    options: StoreServiceUpdateOptions = {},
  ): Promise<StoreEntity> {
    const currentEntity = await this.getOrFail(storeId);
    const newEntity = this.storeRepository.create(currentEntity);
    Object.assign(newEntity, { id: undefined, ...omitBy(data, isEmpty) });

    if (options?.entityManager) {
      return options.entityManager.save(StoreEntity, newEntity);
    }

    return this.storeRepository.save(currentEntity);
  }

  delete(
    storeId: number | number[],
    options: StoreServiceDeleteOptions = {},
  ): Promise<DeleteResult> {
    if (options?.entityManager) {
      return options.entityManager.delete(StoreEntity, storeId);
    }

    return this.storeRepository.delete(storeId);
  }
}
