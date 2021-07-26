import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { DeleteResult, EntityNotFoundError, FindConditions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ErrorBase } from '@common/exceptions';
import { WithPaginationOptions, WithPaginationResult } from '@common/interfaces';
import { isNumber, omit } from 'lodash';
import { printPrefix } from '@common/utils';
import { SearchQuery } from '@common/database';
import { AdminEntity } from './admin.entity';
import {
  AdminServiceCreateOptions,
  AdminServiceDeleteOptions,
  AdminServiceGetManyOptions,
  AdminServiceUpdateOptions,
  ICreateAdmin,
  IUpdateAdmin,
} from './admin.interfaces';
import { adminColumnSearch } from './admin.constants';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(AdminEntity)
    private readonly adminRepository: Repository<AdminEntity>,
    private readonly logger: Logger,
  ) {
    this.logger.setContext('AdminService');
  }

  get repository(): Repository<AdminEntity> {
    return this.adminRepository;
  }

  get(adminId: number | string): Promise<AdminEntity | undefined> {
    const where: FindConditions<AdminEntity> = {};
    if (isNumber(adminId)) {
      where.id = adminId;
    } else {
      where.username = adminId;
    }

    return this.adminRepository.findOne({ where });
  }

  getOrFail(adminId: number | string): Promise<AdminEntity> {
    const where: FindConditions<AdminEntity> = {};
    if (isNumber(adminId)) {
      where.id = adminId;
    } else {
      where.username = adminId;
    }

    try {
      return this.adminRepository.findOneOrFail({ where });
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw new NotFoundException(
          new ErrorBase('Ups... Someting was wrong', {
            devMessage: `Admin ${printPrefix(adminId)} doest not exist`,
          }),
        );
      } else {
        throw error;
      }
    }
  }

  getMany(options: AdminServiceGetManyOptions = {}): Promise<AdminEntity[]> {
    const query = this.adminRepository.createQueryBuilder('admin');

    const searchQuery = new SearchQuery(this.repository, query);
    searchQuery.search(adminColumnSearch, options.globalSearch);
    searchQuery.filter(options.columnSearch);
    searchQuery.dateRange('createdAt', options.dateRange);

    return query.getMany();
  }

  async getManyWithPagination(
    params?: WithPaginationOptions,
  ): Promise<WithPaginationResult<AdminEntity>> {
    let { page = 1, limit = 10 } = params || {};

    if (!page) page = 1;
    if (page < 1) page = 1;
    if (!limit) limit = 1;
    if (limit < 1) limit = 1;

    const offset = limit * (page - 1);
    const total = await this.adminRepository.count();
    const pages = Math.ceil(total / limit);

    const entities = await this.adminRepository.find({
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

  async create(data: ICreateAdmin, options: AdminServiceCreateOptions = {}): Promise<AdminEntity> {
    const current = await this.get(data.username);
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
    const entity = this.adminRepository.create();
    // Solve object key ordering issues
    const insert = { id: undefined, username: undefined, password: undefined, ...data };
    Object.assign(entity, insert);

    this.logger.log('Create admin');
    if (options?.entityManager) {
      return options.entityManager.save(entity);
    }

    return this.adminRepository.save(entity);
  }

  async update(
    adminId: number | string,
    data: IUpdateAdmin,
    options: AdminServiceUpdateOptions = {},
  ) {
    const currentEntity = await this.get(adminId);
    if (!currentEntity) {
      throw new BadRequestException(`Admin ${printPrefix(adminId)} doest not exits`);
    }

    const newEntity = this.adminRepository.create(omit(currentEntity, ['password']));
    Object.assign(newEntity, data);
    this.logger.log(`Update admin ${printPrefix(adminId)}`);

    if (options?.entityManager) {
      return options?.entityManager.save(newEntity);
    }

    return this.adminRepository.save(newEntity);
  }

  delete(
    adminId: number | number[],
    options: AdminServiceDeleteOptions = {},
  ): Promise<DeleteResult> {
    if (options?.entityManager) {
      return options.entityManager.delete(AdminEntity, adminId);
    }

    return this.adminRepository.delete(adminId);
  }
}
