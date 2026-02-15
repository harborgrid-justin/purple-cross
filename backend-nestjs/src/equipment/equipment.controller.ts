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
import { EquipmentService } from './equipment.service';

@Controller('equipment')
export class EquipmentController {
  constructor(private readonly equipmentService: EquipmentService) {}
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body(ValidationPipe) body: any) {
    const equipment = await this.equipmentService.createEquipment(body);
    return equipment ;
  }

  @Get(':id')
  async getById(@Param('id', ParseUUIDPipe) id: string) {
    const equipment = await this.equipmentService.getEquipment(id);
    return equipment ;
  }

  @Get()
  async getAll(@Query() query: any) {
    const { category, status, location, page, limit } = query;
    const result = await this.equipmentService.listEquipment({
      category: category as string,
      status: status as string,
      location: location as string,
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
    });
    return result ;
  }

  @Put(':id')
  async update(@Param('id', ParseUUIDPipe) id: string, @Body(ValidationPipe) body: any) {
    const equipment = await this.equipmentService.updateEquipment(id, body);
    return equipment ;
  }

  @Get(':id/schedulemaintenance')
  async scheduleMaintenance(@Param('id', ParseUUIDPipe) id: string, @Body() body: any) {
    const maintenance = await this.equipmentService.scheduleMaintenance(body);
    return maintenance ;
  }

  @Post('maintenance/:maintenanceId/complete')
  async completeMaintenance(@Param('maintenanceId', ParseUUIDPipe) maintenanceId: string, @Body() body: any) {
    const maintenance = await this.equipmentService.completeMaintenance(
      maintenanceId,
      body
    );
    return maintenance;
  }

  @Get('maintenance/schedule')
  async getMaintenanceSchedule(@Query() query: any) {
    const { equipmentId, status, startDate, endDate, page, limit } = query;
    const result = await this.equipmentService.getMaintenanceSchedule({
      equipmentId: equipmentId as string,
      status: status as string,
      startDate: startDate ? new Date(startDate as string) : undefined,
      endDate: endDate ? new Date(endDate as string) : undefined,
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
    });
    return result ;
  }

  @Get('maintenance/upcoming')
  async getUpcomingMaintenance(@Query() query: any) {
    const { daysAhead } = query;
    const maintenance = await this.equipmentService.getUpcomingMaintenance(
      daysAhead ? parseInt(daysAhead as string) : undefined
    );
    return maintenance ;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    await this.equipmentService.deleteEquipment(id);
    return;
  }
}