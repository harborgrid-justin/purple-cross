import { Request, Response } from 'express';
import prescriptionService from '../services/prescription.service';

export class PrescriptionController {
  async create(req: Request, res: Response) {
    const prescription = await prescriptionService.createPrescription(req.body);
    res.status(201).json({
      status: 'success',
      data: prescription,
    });
  }

  async getById(req: Request, res: Response) {
    const prescription = await prescriptionService.getPrescriptionById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: prescription,
    });
  }

  async getAll(req: Request, res: Response) {
    const { page, limit, patientId, prescribedById, status } = req.query;
    const result = await prescriptionService.getAllPrescriptions({
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
      patientId: patientId as string,
      prescribedById: prescribedById as string,
      status: status as string,
    });
    res.status(200).json({
      status: 'success',
      ...result,
    });
  }

  async update(req: Request, res: Response) {
    const prescription = await prescriptionService.updatePrescription(req.params.id, req.body);
    res.status(200).json({
      status: 'success',
      data: prescription,
    });
  }

  async delete(req: Request, res: Response) {
    await prescriptionService.deletePrescription(req.params.id);
    res.status(204).send();
  }
}

export default new PrescriptionController();
