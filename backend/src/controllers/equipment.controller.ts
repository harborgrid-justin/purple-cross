import { Request, Response } from 'express';
import equipmentService from '../services/equipment.service';
import { HTTP_STATUS } from '../constants';

export class EquipmentController {
  async create(req: Request, res: Response): Promise<void> {
    const equipment = await equipmentService.createEquipment(req.body);
    res.status(HTTP_STATUS.CREATED).json({ status: 'success', data: equipment });
  }

  async getById(req: Request, res: Response): Promise<void> {
    const equipment = await equipmentService.getEquipment(req.params.id);
    res.status(HTTP_STATUS.OK).json({ status: 'success', data: equipment });
  }

  async getAll(req: Request, res: Response): Promise<void> {
    const { category, status, location, page, limit } = req.query;
    const result = await equipmentService.listEquipment({
      category: category as string,
      status: status as string,
      location: location as string,
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
    });
    res.status(HTTP_STATUS.OK).json({ status: 'success', ...result });
  }

  async update(req: Request, res: Response): Promise<void> {
    const equipment = await equipmentService.updateEquipment(req.params.id, req.body);
    res.status(HTTP_STATUS.OK).json({ status: 'success', data: equipment });
  }

  async scheduleMaintenance(req: Request, res: Response): Promise<void> {
    const maintenance = await equipmentService.scheduleMaintenance(req.body);
    res.status(HTTP_STATUS.CREATED).json({ status: 'success', data: maintenance });
  }

  async completeMaintenance(req: Request, res: Response): Promise<void> {
    const maintenance = await equipmentService.completeMaintenance(
      req.params.maintenanceId,
      req.body
    );
    res.status(HTTP_STATUS.OK).json({ status: 'success', data: maintenance });
  }

  async getMaintenanceSchedule(req: Request, res: Response): Promise<void> {
    const { equipmentId, status, startDate, endDate, page, limit } = req.query;
    const result = await equipmentService.getMaintenanceSchedule({
      equipmentId: equipmentId as string,
      status: status as string,
      startDate: startDate ? new Date(startDate as string) : undefined,
      endDate: endDate ? new Date(endDate as string) : undefined,
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
    });
    res.status(HTTP_STATUS.OK).json({ status: 'success', ...result });
  }

  async getUpcomingMaintenance(req: Request, res: Response): Promise<void> {
    const { daysAhead } = req.query;
    const maintenance = await equipmentService.getUpcomingMaintenance(
      daysAhead ? parseInt(daysAhead as string) : undefined
    );
    res.status(HTTP_STATUS.OK).json({ status: 'success', data: maintenance });
  }

  async delete(req: Request, res: Response): Promise<void> {
    await equipmentService.deleteEquipment(req.params.id);
    res.status(HTTP_STATUS.NO_CONTENT).send();
  }
}

export default new EquipmentController();
