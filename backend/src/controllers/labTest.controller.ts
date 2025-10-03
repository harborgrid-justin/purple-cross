import { Request, Response } from 'express';
import labTestService from '../services/labTest.service';

export class LabTestController {
  async create(req: Request, res: Response) {
    const labTest = await labTestService.createLabTest(req.body);
    res.status(201).json({
      status: 'success',
      data: labTest,
    });
  }

  async getById(req: Request, res: Response) {
    const labTest = await labTestService.getLabTestById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: labTest,
    });
  }

  async getAll(req: Request, res: Response) {
    const { page, limit, patientId, orderedById, status } = req.query;
    const result = await labTestService.getAllLabTests({
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
      patientId: patientId as string,
      orderedById: orderedById as string,
      status: status as string,
    });
    res.status(200).json({
      status: 'success',
      ...result,
    });
  }

  async update(req: Request, res: Response) {
    const labTest = await labTestService.updateLabTest(req.params.id, req.body);
    res.status(200).json({
      status: 'success',
      data: labTest,
    });
  }

  async delete(req: Request, res: Response) {
    await labTestService.deleteLabTest(req.params.id);
    res.status(204).send();
  }
}

export default new LabTestController();
