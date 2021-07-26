/* eslint-disable no-console */

import { classToPlain } from 'class-transformer';
import columnify from 'columnify';
import { format } from 'date-fns';
import { filter, isInteger, size, split, toNumber } from 'lodash';
import { Command, Console } from 'nestjs-console';
import { StaffRoleService } from './staff-role.service';

@Console({
  command: 'staff.role',
  description: 'Manage staff roles',
})
export class StaffRoleConsole {
  constructor(private readonly staffRoleService: StaffRoleService) {}

  @Command({
    command: 'get <roleId>',
    alias: 'g',
    description: 'Get staff role',
    options: [
      {
        flags: '-i, --includes [includes]',
        fn: value => filter(split(value, ','), size),
      },
    ],
  })
  async get(roleId: number, options: { includes?: string[] } = {}): Promise<void> {
    roleId = toNumber(roleId);
    if (!isInteger(roleId)) {
      throw new Error('Invalid format argument, <staffId> must be integer');
    }

    const entity = await this.staffRoleService.get(roleId, options);
    console.log(entity);
    if (entity) {
      const data = classToPlain(entity);
      const createdAt = format(data.createdAt, 'Pp');
      const updatedAt = format(data.updatedAt, 'Pp');
      console.log(
        columnify({ ...data, createdAt, updatedAt }, { showHeaders: false, columnSplitter: ' : ' }),
      );
    } else {
      console.log(`Staff Role ID #${roleId} doest not exist`);
    }
  }
}
