import { Request as HttpRequest } from '@common/http';
import { Body, Controller, Get, Post, Request, UseGuards, UseInterceptors } from '@nestjs/common';
import {
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthCredential, AuthLogin } from '@schemas';
import { classToPlain } from 'class-transformer';
import { LoginType } from './auth.constants';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';

@ApiTags('Authorization')
@Controller('/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Staff login', description: 'Its only for staff' })
  @ApiConsumes('application/x-www-form-urlencoded')
  @ApiOkResponse({ type: AuthCredential, description: 'Login success' })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  @Post('login')
  @UseInterceptors()
  async login(@Body() body: AuthLogin): Promise<AuthCredential> {
    return this.authService.login(LoginType.STAFF, body);
  }

  @ApiOperation({ summary: 'Admin login', description: 'Its only for admin' })
  @ApiConsumes('application/x-www-form-urlencoded')
  @ApiOkResponse({ type: AuthCredential, description: 'Login success' })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  @Post('admin/login')
  adminLogin(@Body() body: AuthLogin) {
    return this.authService.login(LoginType.ADMIN, body);
  }

  @UseGuards(AuthGuard)
  @Get('credential')
  // eslint-disable-next-line class-methods-use-this
  getCredential(@Request() req: HttpRequest) {
    return classToPlain(req.credential);
  }
}
