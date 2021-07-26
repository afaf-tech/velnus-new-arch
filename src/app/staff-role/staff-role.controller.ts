/* eslint-disable max-classes-per-file */
/* eslint-disable class-methods-use-this */

import { Controller, Delete, Get, Post, Put } from '@nestjs/common';

@Controller('/staff-roles')
export class StaffRoleController {
  @Post()
  create() {
    // todo
  }

  @Get('/roles')
  get() {
    // todo
  }

  @Put()
  update() {
    // todo
  }

  @Delete()
  delete() {
    // todo
  }
}

@Controller('/store/:storeId/staff-roles')
export class StaffRoleInStoreController {
  @Post()
  create() {
    // todo
  }

  @Get('/')
  get() {
    // todo
  }

  @Put()
  update() {
    // todo
  }

  @Delete()
  delete() {
    // todo
  }
}
