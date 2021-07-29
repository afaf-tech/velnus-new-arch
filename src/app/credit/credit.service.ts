import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ICreateCredit } from 'src/schemas/credit';
import { EntityManager, Repository } from 'typeorm';
import { CreditEntity } from './credit.entity';

@Injectable()
export class CreditService {
  constructor(
    @InjectRepository(CreditEntity) private readonly creditRepository: Repository<CreditEntity>,
  ) {}

  async create(
    data: ICreateCredit,
    options: { entityManager?: EntityManager } = {},
  ): Promise<CreditEntity> {
    const entity = this.creditRepository.create(data);

    if (options.entityManager) {
      return options.entityManager.save(entity);
    }

    return this.creditRepository.save(entity);
  }
}
