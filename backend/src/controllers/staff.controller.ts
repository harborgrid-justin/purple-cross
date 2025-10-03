import { Request, Response } from 'express';
import staffService from '../services/staff.service';

export class StaffController {
  async create(req: Request, res: Response) {
    const staff = await staffService.createStaff(req.body);
    res.status(201).json({
      status: 'success',
      data: staff,
    });
  }

  async getById(req: Request, res: Response) {
    const staff = await staffService.getStaffById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: staff,
    });
  }

  async getAll(req: Request, res: Response) {
    const { page, limit, role, status, search } = req.query;
    const result = await staffService.getAllStaff({
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
      role: role as string,
      status: status as string,
      search: search as string,
    });
    res.status(200).json({
      status: 'success',
      ...result,
    });
  }

  async update(req: Request, res: Response) {
    const staff = await staffService.updateStaff(req.params.id, req.body);
    res.status(200).json({
      status: 'success',
      data: staff,
    });
  }

  async delete(req: Request, res: Response) {
    await staffService.deleteStaff(req.params.id);
    res.status(204).send();
  }
}

export default new StaffController();
