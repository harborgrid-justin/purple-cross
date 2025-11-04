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
    const access = await clientPortalService.createPortalAccess(body);
    return access ;
  }

  @Get(':id')
  async getById(@Param('id', ParseUUIDPipe) id: string) {
    const access = await clientPortalService.getPortalAccess(id);
    return access ;
  }

  async login(req: Request, res: Response) {
    const { email, password } = body;
    const access = await clientPortalService.validateCredentials(email, password);
    if (!access) {
      res.status(401).json({ status: 'error', message: 'Invalid credentials' });
      return;
    }
    return access ;
  }

  async updatePassword(req: Request, res: Response) {
    const { newPassword } = body;
    const access = await clientPortalService.updatePassword(id, newPassword);
    return access ;
  }

  async enableTwoFactor(req: Request, res: Response) {
    const { secret } = body;
    const access = await clientPortalService.enableTwoFactor(id, secret);
    return access ;
  }

  async disableTwoFactor(req: Request, res: Response) {
    const access = await clientPortalService.disableTwoFactor(id);
    return access ;
  }

  @Put(':id')
  async update(@Param('id', ParseUUIDPipe) id: string, @Body(ValidationPipe) body: any) {
    const access = await clientPortalService.updatePortalAccess(id, body);
    return access ;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    await clientPortalService.deletePortalAccess(id);
    return;
  }
}