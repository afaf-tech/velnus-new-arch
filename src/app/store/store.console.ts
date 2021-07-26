/* eslint-disable no-console */
import { printTable } from 'console-table-printer';
import { format } from 'date-fns';
import { isInteger, toNumber, toSafeInteger } from 'lodash';
import { Console, Command } from 'nestjs-console';
import { classToPlain } from 'class-transformer';
import columnify from 'columnify';
import { WithPaginationOptions } from '@common/interfaces';
import { UpdateStore } from '@schemas';
import { StoreService } from './store.service';

@Console({ command: 'store', description: 'Manage stores' })
export class StoreConsole {
  constructor(private readonly storeService: StoreService) {}

  @Command({
    command: 'create <name> <address>',
    alias: 'c',
    description: 'Create new store',
  })
  async createStore(name: string, address: string) {
    const entity = await this.storeService.create({ name, address });
    console.log(`Succesfully create ${entity.name}.\n`);
    const data = classToPlain(entity);
    const createdAt = format(data.createdAt, 'Pp');
    const updatedAt = format(data.updatedAt, 'Pp');
    console.log(
      columnify({ ...data, createdAt, updatedAt }, { showHeaders: false, columnSplitter: ' : ' }),
    );
  }

  @Command({
    command: 'get <storeId>',
    alias: 'g',
    description: 'Get store',
  })
  async getStore(storeId: number): Promise<void> {
    storeId = toNumber(storeId);
    if (!isInteger(storeId)) {
      throw new Error('Invalid format argument, <storeId> must be integer');
    }

    const entity = await this.storeService.get(storeId);
    if (entity) {
      console.log(entity);
      const data = classToPlain(entity);
      const createdAt = format(data.createdAt, 'Pp');
      const updatedAt = format(data.updatedAt, 'Pp');
      console.log(
        columnify({ ...data, createdAt, updatedAt }, { showHeaders: false, columnSplitter: ' : ' }),
      );
    } else {
      console.log(`Store ID #${storeId} doest not exist`);
    }
  }

  @Command({
    command: 'update <storeId>',
    alias: 'u',
    description: 'Update store',
    options: [
      {
        flags: '-n, --name [name]',
        description: 'Store name',
        fn: value => value,
      },
      {
        flags: '-a, --address [address]',
        description: 'Store address',
        fn: value => value,
      },
    ],
  })
  async update(storeId: number, options: UpdateStore): Promise<void> {
    storeId = toNumber(storeId);
    const entity = await this.storeService.update(storeId, options);

    const data = classToPlain(entity);
    const createdAt = format(data.createdAt, 'Pp');
    const updatedAt = format(data.updatedAt, 'Pp');
    console.log(
      columnify({ ...data, createdAt, updatedAt }, { showHeaders: false, columnSplitter: ' : ' }),
    );
  }

  @Command({
    command: 'list',
    alias: 'l',
    description: 'Get store list',
    options: [
      {
        flags: '-p, --page [page]',
        description: 'Show page',
        fn: value => toSafeInteger(value),
      },
      {
        flags: '-l, --limit [limit]',
        description: 'Limit per page',
        fn: value => toSafeInteger(value),
      },
    ],
  })
  async getStoreList(options: WithPaginationOptions): Promise<void> {
    const { data: entities, total, page } = await this.storeService.getManyWithPagination(options);

    if (entities.length) {
      console.log(
        `Found ${entities.length} of ${total} Records in Page ${page.current} of ${page.total}.`,
      );

      const data = entities.map(entity => ({
        ...entity,
        createdAt: format(entity.createdAt, 'Pp'),
        updatedAt: format(entity.updatedAt, 'Pp'),
      }));
      printTable(data);
      console.log(`Limit: ${page.limit}`);
    } else if (page.current > 1) {
      console.log(`Stores in page ${page.current} is empty...`);
    } else {
      console.log(`Stores is empty...`);
    }
    console.log('\n');
  }
}
