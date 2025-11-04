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
    const entry = await waitlistService.addToWaitlist(body);
    return entry ;
  }

  @Get(':id')
  async getById(@Param('id', ParseUUIDPipe) id: string) {
    const entry = await waitlistService.getWaitlistEntry(id);
    return entry ;
  }

  @Get()
  async getAll(@Query() query: any) {
    const { appointmentType, urgency, status, page, limit } = query;
    const result = await waitlistService.listWaitlist({
      appointmentType: appointmentType as string,
      urgency: urgency as string,
      status: status as string,
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
    });
    return result ;
  }

  async notify(req: Request, res: Response) {
    const entry = await waitlistService.notifyWaitlistEntry(id);
    return entry ;
  }

  async book(req: Request, res: Response) {
    const entry = await waitlistService.bookWaitlistEntry(id);
    return entry ;
  }

  async cancel(req: Request, res: Response) {
    const entry = await waitlistService.cancelWaitlistEntry(id);
    return entry ;
  }

  @Put(':id')
  async update(@Param('id', ParseUUIDPipe) id: string, @Body(ValidationPipe) body: any) {
    const entry = await waitlistService.updateWaitlistEntry(id, body);
    return entry ;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    await waitlistService.deleteWaitlistEntry(id);
    return;
  }
}