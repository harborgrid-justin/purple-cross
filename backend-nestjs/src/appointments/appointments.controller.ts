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
import { AppointmentService } from './appointments.service';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentService) {}
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body(ValidationPipe) body: any) {
    const appointment = await appointmentService.createAppointment(body);
    return appointment;
  }

  @Get(':id')
  async getById(@Param('id', ParseUUIDPipe) id: string) {
    const appointment = await appointmentService.getAppointmentById(id);
    return appointment;
  }

  @Get()
  async getAll(@Query() query: any) {
    const { page, limit, patientId, clientId, veterinarianId, status, startDate, endDate } =
      query;
    const result = await appointmentService.getAllAppointments({
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
      patientId: patientId as string,
      clientId: clientId as string,
      veterinarianId: veterinarianId as string,
      status: status as string,
      startDate: startDate ? new Date(startDate as string) : undefined,
      endDate: endDate ? new Date(endDate as string) : undefined,
    });
    return result;
  }

  @Put(':id')
  async update(@Param('id', ParseUUIDPipe) id: string, @Body(ValidationPipe) body: any) {
    const appointment = await appointmentService.updateAppointment(id, body);
    return appointment;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    await appointmentService.deleteAppointment(id);
    return;
  }

  async complete(req: Request, res: Response) {
    const appointment = await appointmentService.completeAppointment(id);
    return appointment;
  }
}