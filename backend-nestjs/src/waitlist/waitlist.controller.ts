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
import { WaitlistService } from './waitlist.service';

@Controller('waitlist')
export class WaitlistController {
  constructor(private readonly waitlistService: WaitlistService) {}
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body(ValidationPipe) body: any) {
    const entry = await this.waitlistService.addToWaitlist(body);
    return entry ;
  }

  @Get(':id')
  async getById(@Param('id', ParseUUIDPipe) id: string) {
    const entry = await this.waitlistService.getWaitlistEntry(id);
    return entry ;
  }

  @Get()
  async getAll(@Query() query: any) {
    const { appointmentType, urgency, status, page, limit } = query;
    const result = await this.waitlistService.listWaitlist({
      appointmentType: appointmentType as string,
      urgency: urgency as string,
      status: status as string,
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
    });
    return result ;
  }

  @Post(':id/notify')
  async notify(@Param('id', ParseUUIDPipe) id: string) {
    const entry = await this.waitlistService.notifyWaitlistEntry(id);
    return entry;
  }

  @Post(':id/book')
  async book(@Param('id', ParseUUIDPipe) id: string) {
    const entry = await this.waitlistService.bookWaitlistEntry(id);
    return entry;
  }

  @Post(':id/cancel')
  async cancel(@Param('id', ParseUUIDPipe) id: string) {
    const entry = await this.waitlistService.cancelWaitlistEntry(id);
    return entry;
  }

  @Put(':id')
  async update(@Param('id', ParseUUIDPipe) id: string, @Body(ValidationPipe) body: any) {
    const entry = await this.waitlistService.updateWaitlistEntry(id, body);
    return entry ;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    await this.waitlistService.deleteWaitlistEntry(id);
    return;
  }
}