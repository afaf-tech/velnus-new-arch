/* eslint-disable no-console */

import { WithPaginationOptions } from '@common/interfaces';
import { CreateAdmin, UpdateAdmin } from '@schemas';
import { classToPlain } from 'class-transformer';
import columnify from 'columnify';
import { printTable } from 'console-table-printer';
import { format } from 'date-fns';
import { isInteger, toNumber, toSafeInteger } from 'lodash';
import { Command, Console } from 'nestjs-console';
import { AdminService } from './admin.service';

@Console({
  command: 'admin',
  description: 'Manage admin',
})
export class AdminConsole {
  constructor(private readonly adminService: AdminService) {}

  @Command({
    command: 'create',
    alias: 'c',
    description: 'Create new store',
    options: [
      {
        flags: '-u, --username <username>',
        description: 'Admin username',
        required: true,
      },
      {
        flags: '-p, --password <password>',
        description: 'Admin password',
        required: true,
      },
    ],
  })
  async create(options: CreateAdmin): Promise<void> {
    const entity = await this.adminService.create(options);
    console.log(`Create "${entity.username}" success.\n`);
    const data = classToPlain(entity);
    const createdAt = format(data.createdAt, 'Pp');
    const updatedAt = format(data.updatedAt, 'Pp');
    console.log(
      columnify({ ...data, createdAt, updatedAt }, { showHeaders: false, columnSplitter: ' : ' }),
    );
  }

  @Command({
    command: 'get <adminId>',
    alias: 'g',
    description: 'Get admin',
  })
  async getStore(adminId: number): Promise<void> {
    adminId = toNumber(adminId);
    if (!isInteger(adminId)) {
      throw new Error('Invalid format argument, <adminId> must be integer');
    }

    const entity = await this.adminService.get(adminId);
    if (entity) {
      const data = classToPlain(entity);
      const createdAt = format(data.createdAt, 'Pp');
      const updatedAt = format(data.updatedAt, 'Pp');
      console.log(
        columnify({ ...data, createdAt, updatedAt }, { showHeaders: false, columnSplitter: ' : ' }),
      );
    } else {
      console.log(`Admin ID #${adminId} doest not exist`);
    }
  }

  @Command({
    command: 'update <adminId>',
    alias: 'u',
    description: 'Update admin',
    options: [
      {
        flags: '-u, --username [username]',
        description: 'Admin username',
        fn: value => value,
      },
      {
        flags: '-p, --password [password]',
        description: 'Admin password',
        fn: value => value,
      },
    ],
  })
  async update(adminId: number, options: UpdateAdmin) {
    adminId = toNumber(adminId);
    const entity = await this.adminService.update(adminId, options);
    console.log(`Update ${entity.username} success.\n`);

    const data = classToPlain(entity);
    const createdAt = format(entity.createdAt, 'Pp');
    const updatedAt = format(entity.updatedAt, 'Pp');
    console.log(
      columnify({ ...data, createdAt, updatedAt }, { showHeaders: false, columnSplitter: ' : ' }),
    );
  }

  @Command({
    command: 'list',
    alias: 'l',
    description: 'Get admin list',
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
  async list(options: WithPaginationOptions): Promise<void> {
    const { data: entities, total, page } = await this.adminService.getManyWithPagination(options);

    if (entities.length) {
      console.log(
        `Found ${entities.length} of ${total} Records in Page ${page.current} of ${page.total}.`,
      );

      const data = entities.map(entity => ({
        ...classToPlain(entity),
        createdAt: format(entity.createdAt, 'Pp'),
        updatedAt: format(entity.updatedAt, 'Pp'),
      }));
      printTable(data);
      console.log(`Limit: ${page.limit}`);
    } else if (page.current > 1) {
      console.log(`Admins in page ${page.current} is empty...`);
    } else {
      console.log(`Admins is empty...`);
    }
    console.log('\n');
  }
}
