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
    const equipment = await equipmentService.createEquipment(body);
    return equipment ;
  }

  @Get(':id')
  async getById(@Param('id', ParseUUIDPipe) id: string) {
    const equipment = await equipmentService.getEquipment(id);
    return equipment ;
  }

  @Get()
  async getAll(@Query() query: any) {
    const { category, status, location, page, limit } = query;
    const result = await equipmentService.listEquipment({
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
    const equipment = await equipmentService.updateEquipment(id, body);
    return equipment ;
  }

  async scheduleMaintenance(req: Request, res: Response) {
    const maintenance = await equipmentService.scheduleMaintenance(body);
    return maintenance ;
  }

  async completeMaintenance(req: Request, res: Response) {
    const maintenance = await equipmentService.completeMaintenance(
      req.params.maintenanceId,
      body
    );
    return maintenance ;
  }

  async getMaintenanceSchedule(req: Request, res: Response) {
    const { equipmentId, status, startDate, endDate, page, limit } = query;
    const result = await equipmentService.getMaintenanceSchedule({
      equipmentId: equipmentId as string,
      status: status as string,
      startDate: startDate ? new Date(startDate as string) : undefined,
      endDate: endDate ? new Date(endDate as string) : undefined,
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
    });
    return result ;
  }

  async getUpcomingMaintenance(req: Request, res: Response) {
    const { daysAhead } = query;
    const maintenance = await equipmentService.getUpcomingMaintenance(
      daysAhead ? parseInt(daysAhead as string) : undefined
    );
    return maintenance ;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    await equipmentService.deleteEquipment(id);
    return;
  }
}