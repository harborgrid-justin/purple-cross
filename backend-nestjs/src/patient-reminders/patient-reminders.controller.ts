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
import { PatientReminderService } from './patient-reminders.service';

@Controller('patient-reminders')
export class PatientRemindersController {
  constructor(private readonly patientRemindersService: PatientReminderService) {}
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body(ValidationPipe) body: any) {
    const reminder = await patientReminderService.createReminder(body);
    return reminder ;
  }

  @Get(':id')
  async getById(@Param('id', ParseUUIDPipe) id: string) {
    const reminder = await patientReminderService.getReminder(id);
    return reminder ;
  }

  @Get()
  async getAll(@Query() query: any) {
    const { patientId, reminderType, status, startDate, endDate, page, limit } = query;
    const result = await patientReminderService.listReminders({
      patientId: patientId as string,
      reminderType: reminderType as string,
      status: status as string,
      startDate: startDate ? new Date(startDate as string) : undefined,
      endDate: endDate ? new Date(endDate as string) : undefined,
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
    });
    return result ;
  }

  async getDue(_req: Request, res: Response) {
    const reminders = await patientReminderService.getDueReminders();
    return reminders ;
  }

  async complete(req: Request, res: Response) {
    const reminder = await patientReminderService.completeReminder(id);
    return reminder ;
  }

  @Put(':id')
  async update(@Param('id', ParseUUIDPipe) id: string, @Body(ValidationPipe) body: any) {
    const reminder = await patientReminderService.updateReminder(id, body);
    return reminder ;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    await patientReminderService.deleteReminder(id);
    return;
  }
}