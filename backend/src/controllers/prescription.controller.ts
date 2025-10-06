import { Request, Response } from 'express';
import prescriptionService from '../services/prescription.service';
import { HTTP_STATUS } from '../constants';

export class PrescriptionController {
  async create(req: Request, res: Response): Promise<void> {
    const prescription = await prescriptionService.createPrescription(req.body);
    res.status(HTTP_STATUS.CREATED).json({
      status: 'success',
      data: prescription,
    });
  }

  async getById(req: Request, res: Response): Promise<void> {
    const prescription = await prescriptionService.getPrescriptionById(req.params.id);
    res.status(HTTP_STATUS.OK).json({
      status: 'success',
      data: prescription,
    });
  }

  async getAll(req: Request, res: Response): Promise<void> {
    const { page, limit, patientId, prescribedById, status } = req.query;
    const result = await prescriptionService.getAllPrescriptions({
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
      patientId: patientId as string,
      prescribedById: prescribedById as string,
      status: status as string,
    });
    res.status(HTTP_STATUS.OK).json({
      status: 'success',
      ...result,
    });
  }

  async update(req: Request, res: Response): Promise<void> {
    const prescription = await prescriptionService.updatePrescription(req.params.id, req.body);
    res.status(HTTP_STATUS.OK).json({
      status: 'success',
      data: prescription,
    });
  }

  async delete(req: Request, res: Response): Promise<void> {
    await prescriptionService.deletePrescription(req.params.id);
    res.status(HTTP_STATUS.NO_CONTENT).send();
  }
}

export default new PrescriptionController();
