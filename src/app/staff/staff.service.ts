import { ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import {
  DeleteResult,
  EntityNotFoundError,
  FindConditions,
  FindOneOptions,
  In,
  Repository,
} from 'typeorm';
import isNumber from 'lodash/isNumber';
import { InjectRepository } from '@nestjs/typeorm';
import { ErrorBase } from '@common/exceptions';
import { printPrefix } from '@common/utils';
import type { WithPaginationOptions, WithPaginationResult } from '@common/interfaces';
import { omit, pickBy, identity } from 'lodash';
import { StaffRolePermissionService } from '@app/staff-role-permission/staff-role-permission.service';
import { SearchQuery } from '@common/database';
import { StaffEntity } from './staff.entity';
import {
  ICreateStaff,
  IUpdateStaff,
  StaffServiceCreateOptions,
  StaffServiceDeleteOptions,
  StaffServiceGetManyOptions,
  StaffServiceGetOptions,
  StaffServiceUpdateOptions,
} from './staff.interfaces';
import { staffColumnSearch } from './staff.constants';

@Injectable()
export class StaffService {
  constructor(
    @InjectRepository(StaffEntity)
    private readonly staffRepository: Repository<StaffEntity>,
    private readonly staffRolePermissionService: StaffRolePermissionService,
    private readonly logger: Logger,
  ) {
    this.logger.setContext('StaffService');
  }

  get repository(): Repository<StaffEntity> {
    return this.staffRepository;
  }

  get(
    staffId: number | string,
    options: StaffServiceGetOptions = {},
  ): Promise<StaffEntity | undefined> {
    const where: FindConditions<StaffEntity> = {};
    if (isNumber(staffId)) {
      where.id = staffId;
    } else {
      where.username = staffId;
    }

    if ('storeId' in options) where.storeId = options.storeId;
    const queries: FindOneOptions<StaffEntity> = { where };

    return this.staffRepository.findOne(queries);
  }

  getOrFail(staffId: number | string, options: StaffServiceGetOptions = {}): Promise<StaffEntity> {
    const where: FindConditions<StaffEntity> = {};
    if (isNumber(staffId)) {
      where.id = staffId;
    } else {
      where.username = staffId;
    }

    if ('storeId' in options) where.storeId = options.storeId;
    const queries: FindOneOptions<StaffEntity> = { where };

    try {
      return this.staffRepository.findOneOrFail(queries);
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw new NotFoundException(
          new ErrorBase('Ups... Someting was wrong', {
            devMessage: `Staff ${printPrefix(staffId)} doest not exist`,
          }),
        );
      } else {
        throw error;
      }
    }
  }

  getMany(options: StaffServiceGetManyOptions = {}): Promise<StaffEntity[]> {
    const { metadata: meta } = this.staffRepository;
    const query = this.staffRepository.createQueryBuilder(meta.tableName);

    const searchQuery = new SearchQuery(this.repository, query);
    searchQuery.search(staffColumnSearch, options.globalSearch);
    searchQuery.filter(options.columnSearch);
    searchQuery.dateRange('createdAt', options.dateRange);

    return query.getMany();
  }

  async getManyWithPagination(
    params?: WithPaginationOptions,
  ): Promise<WithPaginationResult<StaffEntity>> {
    let { page = 1, limit = 10 } = params || {};

    if (!page) page = 1;
    if (page < 1) page = 1;
    if (!limit) limit = 1;
    if (limit < 1) limit = 1;

    const offset = limit * (page - 1);
    const total = await this.staffRepository.count();
    const pages = Math.ceil(total / limit);

    const entities = await this.staffRepository.find({
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

  async create(data: ICreateStaff, options: StaffServiceCreateOptions = {}): Promise<StaffEntity> {
    const current = await this.get(data.username, { storeId: options.storeId });
    if (current) {
      const errorParam = {
        solution: 'Try changing to another username',
        detail:
          'This happens because you have entered a username that has been registered in our system',
      };

      throw new ConflictException(
        new ErrorBase(`Username ${data.username} already used`, errorParam),
      );
    }
    const entity = this.staffRepository.create({});
    // Solve object key ordering issues by adding undefined value
    Object.assign(entity, {
      id: undefined,
      username: undefined,
      password: undefined,
      // remove undefined object value using lodash
      ...pickBy(data, identity),
    });
    this.logger.log('Create staff');

    if (options?.entityManager) {
      return options.entityManager.save(StaffEntity, entity);
    }

    return this.staffRepository.save(entity);
  }

  async update(
    staffId: number,
    data: IUpdateStaff,
    options: StaffServiceUpdateOptions = {},
  ): Promise<StaffEntity> {
    const currentEntity = await this.getOrFail(staffId, { storeId: options.storeId });
    const newEntity = this.staffRepository.create(omit(currentEntity, ['password']));
    Object.assign(newEntity, data);
    this.logger.log(`Update staff ${printPrefix(staffId)}`);

    if (options?.entityManager) {
      return options.entityManager.save(StaffEntity, newEntity);
    }

    return this.staffRepository.save(newEntity);
  }

  delete(
    staffId: number | number[],
    options: StaffServiceDeleteOptions = {},
  ): Promise<DeleteResult> {
    const where: FindConditions<StaffEntity> = {};

    if (Array.isArray(staffId)) {
      where.id = In(staffId);
    } else {
      where.id = staffId;
    }

    if ('storeId' in options) {
      where.storeId = options.storeId;
    }

    if (options.entityManager) {
      return options.entityManager.delete(StaffEntity, where);
    }

    return this.staffRepository.delete(where);
  }

  async getPermissions(staff: StaffEntity): Promise<string[]> {
    const perms = await this.staffRolePermissionService.repository.find({
      roleId: staff.roleId,
    });

    return perms.map(item => item.permission);
  }
}
