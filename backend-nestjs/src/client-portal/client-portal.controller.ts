import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
  ValidationPipe,
} from '@nestjs/common';
import { ClientPortalService } from './client-portal.service';

@Controller('client-portal')
export class ClientPortalController {
  constructor(private readonly clientPortalService: ClientPortalService) {}
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body(ValidationPipe) body: any) {
    const access = await this.clientPortalService.createPortalAccess(body);
    return access ;
  }

  @Get(':id')
  async getById(@Param('id', ParseUUIDPipe) id: string) {
    const access = await this.clientPortalService.getPortalAccess(id);
    return access ;
  }

  @Post('login')
  async login(@Body() body: any) {
    const { email, password } = body;
    const access = await this.clientPortalService.validateCredentials(email, password);
    if (!access) {
      throw new Error('Invalid credentials');
    }
    return access;
  }

  @Put(':id/password')
  async updatePassword(@Param('id', ParseUUIDPipe) id: string, @Body() body: any) {
    const { newPassword } = body;
    const access = await this.clientPortalService.updatePassword(id, newPassword);
    return access;
  }

  @Post(':id/two-factor/enable')
  async enableTwoFactor(@Param('id', ParseUUIDPipe) id: string, @Body() body: any) {
    const { secret } = body;
    const access = await this.clientPortalService.enableTwoFactor(id, secret);
    return access;
  }

  @Post(':id/two-factor/disable')
  async disableTwoFactor(@Param('id', ParseUUIDPipe) id: string) {
    const access = await this.clientPortalService.disableTwoFactor(id);
    return access;
  }

  @Put(':id')
  async update(@Param('id', ParseUUIDPipe) id: string, @Body(ValidationPipe) body: any) {
    const access = await this.clientPortalService.updatePortalAccess(id, body);
    return access ;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    await this.clientPortalService.deletePortalAccess(id);
    return;
  }
}