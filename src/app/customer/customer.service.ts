import { SearchQuery } from '@common/database';
import { ErrorBase } from '@common/exceptions';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ConflictException } from '@nestjs/common/exceptions/conflict.exception';
import { InjectRepository } from '@nestjs/typeorm';
import { omit } from 'lodash';
import {
  DeleteResult,
  EntityManager,
  EntityNotFoundError,
  FindConditions,
  In,
  Repository,
} from 'typeorm';
import { customerColumnSearch } from './customer.constant';
import { CustomerEntity } from './customer.entity';
import {
  CustomerServiceGetManyOptions,
  ICreateCustomer,
  IUpdateCustomer,
} from './customer.interface';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(CustomerEntity)
    private readonly customerRepository: Repository<CustomerEntity>,
  ) {}

  get repository(): Repository<CustomerEntity> {
    return this.customerRepository;
  }

  getMany(options: CustomerServiceGetManyOptions = {}): Promise<CustomerEntity[]> {
    const { metadata: meta } = this.customerRepository;
    const query = this.customerRepository.createQueryBuilder(meta.tableName);

    const searchQuery = new SearchQuery(this.repository, query);
    searchQuery.search(customerColumnSearch, options.globalSearch);
    searchQuery.filter(options.columnSearch);
    searchQuery.dateRange('createdAt', options.dateRange);
    return query.getMany();
  }

  async getOrFail(customerId: number, storeId?: number): Promise<CustomerEntity> {
    let param = {};
    if (storeId) {
      param = { id: customerId, storeId };
    } else {
      param = { id: customerId };
    }
    try {
      return await this.customerRepository.findOneOrFail({
        where: param,
      });
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw new NotFoundException(
          new ErrorBase('Ups... Someting was wrong', {
            devMessage: `Customer #${customerId} doest not exist`,
          }),
        );
      } else {
        throw error;
      }
    }
  }

  async create(data: ICreateCustomer, entityManager?: EntityManager): Promise<CustomerEntity> {
    const entity = this.customerRepository.create({
      name: data.name,
      phoneNumber: data.phoneNumber,
      email: data.email,
      address: data.address,
      password: data.password,
      storeId: data.storeId,
    });

    if (entityManager) {
      return entityManager.save(entity);
    }
    let customerEntity: CustomerEntity;
    try {
      customerEntity = await this.customerRepository.save(entity);
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (error.errno === 1062) {
        throw new ConflictException(
          new ErrorBase(
            `phone number or email might be already in use, ${data.phoneNumber} - ${
              data.email ? data.email : ''
            }`,
            {
              solution: 'Try to change phone or your email',
              detail:
                'This happens because you have entered an email or phone that has been registered in our system',
            },
          ),
        );
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      } else if (error.errno === 1452) {
        throw new ConflictException(
          new ErrorBase(`store with id ${data.storeId} does not exist.`, {
            solution: 'Try to change storeId',
            detail: '',
          }),
        );
      }
    }
    return customerEntity;
  }

  async update(customerId: number, data: IUpdateCustomer): Promise<CustomerEntity> {
    const currentEntity = await this.getOrFail(customerId, data.storeId);
    const newEntity = this.customerRepository.create(omit(currentEntity, ['password']));
    Object.assign(newEntity, data);

    return this.customerRepository.save(newEntity);
  }

  async remove(customerId: number, options?: { storeId: number }): Promise<CustomerEntity> {
    const entity = await this.getOrFail(customerId, options?.storeId);
    return this.customerRepository.remove(entity);
  }

  async delete(
    customerId: number | number[],
    options?: { storeId: number },
  ): Promise<DeleteResult> {
    const where: FindConditions<CustomerEntity> = {};

    if (Array.isArray(customerId)) {
      where.id = In(customerId);
    } else {
      where.id = customerId;
    }

    if ('storeId' in options) {
      where.storeId = options.storeId;
    }

    return this.customerRepository.delete(where);
  }
}
