import { AuthGuard } from '@app/auth/auth.guard';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Admin, CreateAdmin, GetAdminQuery, UpdateAdmin } from '@schemas';
import { plainToClass } from 'class-transformer';
import { AdminService } from './admin.service';

@ApiTags('Admins')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard)
@Controller('/admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @ApiOperation({ description: 'Get admins' })
  @ApiOkResponse({ type: [Admin] })
  @Get('/')
  async getMany(@Query() query: GetAdminQuery): Promise<Admin[]> {
    const entities = await this.adminService.getMany({
      globalSearch: query.search,
      dateRange: query.rangedate ? query.rangedate.split('_') : null,
    });
    return entities.map(entity => plainToClass(Admin, entity));
  }

  @ApiConsumes('application/x-www-form-urlencoded')
  @ApiOperation({ description: 'Create new admin' })
  @ApiOkResponse({ type: Admin })
  @Post('/')
  async create(@Body() body: CreateAdmin): Promise<Admin> {
    const entity = await this.adminService.create(body);
    return plainToClass(Admin, entity);
  }

  @ApiOperation({ description: 'Get admin' })
  @ApiOkResponse({ type: Admin })
  @Get('/:adminId')
  async get(@Query('adminId', ParseIntPipe) adminId: number): Promise<Admin> {
    const entity = await this.adminService.getOrFail(adminId);
    return plainToClass(Admin, entity);
  }

  @ApiConsumes('application/x-www-form-urlencoded')
  @ApiOperation({ description: 'Update admin data' })
  @ApiOkResponse({ type: Admin })
  @Put('/:adminId')
  async update(
    @Param('adminId', ParseIntPipe) adminId: number,
    @Body() body: UpdateAdmin,
  ): Promise<Admin> {
    const entity = await this.adminService.update(adminId, body);
    return plainToClass(Admin, entity);
  }

  @ApiOperation({ description: 'Delete admin' })
  @Delete('/:adminId')
  delete(@Param('adminId', ParseIntPipe) adminId: number) {
    return this.adminService.delete(adminId);
  }
}
