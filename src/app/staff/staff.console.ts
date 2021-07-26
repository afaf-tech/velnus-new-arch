/* eslint-disable no-console */

import { WithPaginationOptions } from '@common/interfaces';
import { CreateStaff, UpdateStaff } from '@schemas';
import { classToPlain } from 'class-transformer';
import columnify from 'columnify';
import { printTable } from 'console-table-printer';
import { format } from 'date-fns';
import { isInteger, toNumber, toSafeInteger } from 'lodash';
import { Command, Console } from 'nestjs-console';
import { StaffService } from './staff.service';

@Console({
  command: 'staff',
  description: 'Manage staff',
})
export class StaffConsole {
  constructor(private readonly staffService: StaffService) {}

  @Command({
    command: 'create <storeId>',
    alias: 'c',
    description: 'Create new store',
    options: [
      {
        flags: '-u, --username <username>',
        description: 'Staff username',
        required: true,
      },
      {
        flags: '-p, --password <password>',
        description: 'Staff password',
        required: true,
      },
      {
        flags: '-n, --name <name>',
        description: 'Staff name',
        required: true,
      },
      {
        flags: '-a, --address <address>',
        description: '',
        required: true,
      },
      {
        flags: '-p, --position [position]',
        description: '',
      },
      {
        flags: '-r, --roleId [roleId]',
        description: '',
      },
    ],
  })
  async create(storeId: number, options: CreateStaff): Promise<void> {
    storeId = toNumber(storeId);
    if (!isInteger(storeId)) {
      throw new Error('Invalid format argument, <storeId> must be integer');
    }

    console.log(options);
    const entity = await this.staffService.create({ ...options, storeId });
    console.log(`Create "${entity.username}" success.\n`);
    const data = classToPlain(entity);
    const createdAt = format(data.createdAt, 'Pp');
    const updatedAt = format(data.updatedAt, 'Pp');
    console.log(
      columnify({ ...data, createdAt, updatedAt }, { showHeaders: false, columnSplitter: ' : ' }),
    );
  }

  @Command({
    command: 'get <staffId>',
    alias: 'g',
    description: 'Get staff',
  })
  async get(staffId: number): Promise<void> {
    staffId = toNumber(staffId);
    if (!isInteger(staffId)) {
      throw new Error('Invalid format argument, <staffId> must be integer');
    }

    const entity = await this.staffService.get(staffId);
    if (entity) {
      const data = classToPlain(entity);
      const createdAt = format(data.createdAt, 'Pp');
      const updatedAt = format(data.updatedAt, 'Pp');
      console.log(
        columnify({ ...data, createdAt, updatedAt }, { showHeaders: false, columnSplitter: ' : ' }),
      );
    } else {
      console.log(`Staff ID #${staffId} doest not exist`);
    }
  }

  @Command({
    command: 'update <StaffId>',
    alias: 'u',
    description: 'Update staff',
    options: [
      {
        flags: '-u, --username [username]',
        description: 'Staff username',
      },
      {
        flags: '-p, --password [password]',
        description: 'STaff password',
      },
      {
        flags: '-n, --name [name]',
        description: 'Staff name',
      },
      {
        flags: '-a, --address <address>',
        description: '',
      },
      {
        flags: '-p, --position <position>',
        description: '',
      },
    ],
  })
  async update(staffId: number, options: UpdateStaff) {
    staffId = toNumber(staffId);
    const entity = await this.staffService.update(staffId, options);
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
    description: 'Get staff list',
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
    const { data: entities, total, page } = await this.staffService.getManyWithPagination(options);

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
      console.log(`Staffs in page ${page.current} is empty...`);
    } else {
      console.log(`Staffs is empty...`);
    }
    console.log('\n');
  }
}
