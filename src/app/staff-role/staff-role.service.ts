import { StaffRolePermissionService } from '@app/staff-role-permission/staff-role-permission.service';
import { SearchQuery } from '@common/database';
import { ErrorBase } from '@common/exceptions';
import { WithPaginationOptions, WithPaginationResult } from '@common/interfaces';
import { printPrefix } from '@common/utils';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { identity, isNumber, omit, pickBy } from 'lodash';
import {
  Connection,
  DeleteResult,
  EntityManager,
  EntityNotFoundError,
  FindConditions,
  FindOneOptions,
  Repository,
} from 'typeorm';
import { staffRoleColumnSearch } from './staff-role.constants';
import { StaffRoleEntity } from './staff-role.entity';
import {
  ICreateStaffRole,
  IUpdateStaffRole,
  StaffRoleServiceCreateOptions,
  StaffRoleServiceDeleteOptions,
  StaffRoleServiceGetManyOptions,
  StaffRoleServiceGetOptions,
  StaffRoleServiceUpdateOptions,
} from './staff-role.interfaces';

@Injectable()
export class StaffRoleService {
  constructor(
    private readonly connection: Connection,
    private readonly logger: Logger,
    @InjectRepository(StaffRoleEntity)
    private readonly staffRoleRepository: Repository<StaffRoleEntity>,
    private readonly staffRolePermissionService: StaffRolePermissionService,
  ) {
    this.logger.setContext('StaffRoleService');
  }

  get repository(): Repository<StaffRoleEntity> {
    return this.staffRoleRepository;
  }

  get(
    roleId: number | string,
    options: StaffRoleServiceGetOptions = {},
  ): Promise<StaffRoleEntity | undefined> {
    const where: FindConditions<StaffRoleEntity> = {};
    if (isNumber(roleId)) {
      where.id = roleId;
    } else {
      where.slug = roleId;
    }

    const queries: FindOneOptions<StaffRoleEntity> = { where };

    if (options.includes) {
      if (options.includes.indexOf('permissions') !== 1) {
        queries.relations = ['permissions'];
      }
    }

    return this.staffRoleRepository.findOne(queries);
  }

  getOrFail(
    roleId: number | string,
    options: StaffRoleServiceGetOptions = {},
  ): Promise<StaffRoleEntity> {
    const where: FindConditions<StaffRoleEntity> = {};
    if (isNumber(roleId)) {
      where.id = roleId;
    } else {
      where.slug = roleId;
    }

    if ('storeId' in options) where.storeId = options.storeId;
    const queries: FindOneOptions<StaffRoleEntity> = { where };

    try {
      return this.staffRoleRepository.findOneOrFail(queries);
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw new NotFoundException(
          new ErrorBase('Ups... Someting was wrong', {
            devMessage: `Staff role ${printPrefix(roleId)} doest not exist`,
          }),
        );
      } else {
        throw error;
      }
    }
  }

  getMany(options: StaffRoleServiceGetManyOptions = {}): Promise<StaffRoleEntity[]> {
    const { metadata: meta } = this.staffRoleRepository;
    const query = this.staffRoleRepository.createQueryBuilder(meta.tableName);

    const searchQuery = new SearchQuery(this.repository, query);
    searchQuery.search(staffRoleColumnSearch, options.globalSearch);
    searchQuery.filter(options.columnSearch);
    searchQuery.dateRange('createdAt', options.dateRange);

    return query.getMany();
  }

  async getManyWithPagination(
    params?: WithPaginationOptions,
  ): Promise<WithPaginationResult<StaffRoleEntity>> {
    let { page = 1, limit = 10 } = params || {};

    if (!page) page = 1;
    if (page < 1) page = 1;
    if (!limit) limit = 1;
    if (limit < 1) limit = 1;

    const offset = limit * (page - 1);
    const total = await this.staffRoleRepository.count();
    const pages = Math.ceil(total / limit);

    const entities = await this.staffRoleRepository.find({
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

  async create(
    data: ICreateStaffRole,
    options: StaffRoleServiceCreateOptions = {},
  ): Promise<StaffRoleEntity> {
    const current = await this.get(data.slug);

    if (current) {
      const errorParam = { solution: 'Choose different slug name' };
      throw new ConflictException(new ErrorBase(`Slug ${data.slug} already used`, errorParam));
    }

    const staffRoleEntity = this.staffRoleRepository.create();
    const { permissions, ...otherData } = data;
    Object.assign(staffRoleEntity, pickBy({ ...otherData, storeId: data.storeId }, identity));

    this.logger.log('Create role');

    // only if have permission transaction will be runned
    if (data.permissions && data.permissions.length) {
      // exec save
      const save = async (entityManager: EntityManager) => {
        const newStaffRoleEntity = await entityManager.save(staffRoleEntity);

        const staffRolePermissionEntities = await this.staffRolePermissionService.addPermissions(
          data.storeId,
          newStaffRoleEntity.id,
          data.permissions,
          { entityManager },
        );

        if (Array.isArray(staffRolePermissionEntities)) {
          newStaffRoleEntity.permissions = staffRolePermissionEntities;
        }

        return newStaffRoleEntity;
      };

      // create transaction when don't have entityManager
      if (!options.entityManager) {
        return this.connection.transaction(entityManager => save(entityManager));
      }

      return save(options.entityManager);
    }

    return this.staffRoleRepository.save(staffRoleEntity);
  }

  async update(
    roleId: number | string,
    data: IUpdateStaffRole,
    options: StaffRoleServiceUpdateOptions = {},
  ): Promise<StaffRoleEntity> {
    const currentEntity = await this.get(roleId);
    if (!currentEntity) {
      throw new BadRequestException(`Role ${printPrefix(roleId)} doest not exits`);
    }

    const newEntity = this.staffRoleRepository.create(omit(currentEntity, ['password']));
    Object.assign(newEntity, data);
    this.logger.log(`Update roled ${printPrefix(roleId)}`);

    if (options?.entityManager) {
      return options.entityManager.save(newEntity);
    }

    return this.staffRoleRepository.save(newEntity);
  }

  delete(
    storeId: number | number[],
    options: StaffRoleServiceDeleteOptions = {},
  ): Promise<DeleteResult> {
    if (options?.entityManager) {
      return options.entityManager.delete(StaffRoleEntity, storeId);
    }
    return this.staffRoleRepository.delete(storeId);
  }
}
