import { Request, Response } from 'express';
import patientService from '../services/patient.service';

export class PatientController {
  async create(req: Request, res: Response): Promise<void> {
    const patient = await patientService.createPatient(req.body);
    res.status(201).json({
      status: 'success',
      data: patient,
    });
  }

  async getById(req: Request, res: Response): Promise<void> {
    const patient = await patientService.getPatientById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: patient,
    });
  }

  async getAll(req: Request, res: Response): Promise<void> {
    const { page, limit, search, ownerId } = req.query;
    const result = await patientService.getAllPatients({
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
      search: search as string,
      ownerId: ownerId as string,
    });
    res.status(200).json({
      status: 'success',
      ...result,
    });
  }

  async update(req: Request, res: Response): Promise<void> {
    const patient = await patientService.updatePatient(req.params.id, req.body);
    res.status(200).json({
      status: 'success',
      data: patient,
    });
  }

  async delete(req: Request, res: Response): Promise<void> {
    await patientService.deletePatient(req.params.id);
    res.status(204).send();
  }
}

export default new PatientController();
