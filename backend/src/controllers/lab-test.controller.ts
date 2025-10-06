import { Request, Response } from 'express';
import labTestService from '../services/lab-test.service';
import { HTTP_STATUS } from '../constants';

export class LabTestController {
  async create(req: Request, res: Response): Promise<void> {
    const labTest = await labTestService.createLabTest(req.body);
    res.status(HTTP_STATUS.CREATED).json({
      status: 'success',
      data: labTest,
    });
  }

  async getById(req: Request, res: Response): Promise<void> {
    const labTest = await labTestService.getLabTestById(req.params.id);
    res.status(HTTP_STATUS.OK).json({
      status: 'success',
      data: labTest,
    });
  }

  async getAll(req: Request, res: Response): Promise<void> {
    const { page, limit, patientId, orderedById, status } = req.query;
    const result = await labTestService.getAllLabTests({
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
      patientId: patientId as string,
      orderedById: orderedById as string,
      status: status as string,
    });
    res.status(HTTP_STATUS.OK).json({
      status: 'success',
      ...result,
    });
  }

  async update(req: Request, res: Response): Promise<void> {
    const labTest = await labTestService.updateLabTest(req.params.id, req.body);
    res.status(HTTP_STATUS.OK).json({
      status: 'success',
      data: labTest,
    });
  }

  async delete(req: Request, res: Response): Promise<void> {
    await labTestService.deleteLabTest(req.params.id);
    res.status(HTTP_STATUS.NO_CONTENT).send();
  }
}

export default new LabTestController();
