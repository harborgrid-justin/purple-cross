import { Request, Response } from 'express';
import staffService from '../services/staff.service';
import { HTTP_STATUS } from '../constants';

export class StaffController {
  async create(req: Request, res: Response): Promise<void> {
    const staff = await staffService.createStaff(req.body);
    res.status(HTTP_STATUS.CREATED).json({
      status: 'success',
      data: staff,
    });
  }

  async getById(req: Request, res: Response): Promise<void> {
    const staff = await staffService.getStaffById(req.params.id);
    res.status(HTTP_STATUS.OK).json({
      status: 'success',
      data: staff,
    });
  }

  async getAll(req: Request, res: Response): Promise<void> {
    const { page, limit, role, status, search } = req.query;
    const result = await staffService.getAllStaff({
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
      role: role as string,
      status: status as string,
      search: search as string,
    });
    res.status(HTTP_STATUS.OK).json({
      status: 'success',
      ...result,
    });
  }

  async update(req: Request, res: Response): Promise<void> {
    const staff = await staffService.updateStaff(req.params.id, req.body);
    res.status(HTTP_STATUS.OK).json({
      status: 'success',
      data: staff,
    });
  }

  async delete(req: Request, res: Response): Promise<void> {
    await staffService.deleteStaff(req.params.id);
    res.status(HTTP_STATUS.NO_CONTENT).send();
  }
}

export default new StaffController();
