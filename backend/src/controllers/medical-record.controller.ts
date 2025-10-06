import { Request, Response } from 'express';
import medicalRecordService from '../services/medical-record.service';

export class MedicalRecordController {
  async create(req: Request, res: Response) {
    const record = await medicalRecordService.createMedicalRecord(req.body);
    res.status(201).json({
      status: 'success',
      data: record,
    });
  }

  async getById(req: Request, res: Response) {
    const record = await medicalRecordService.getMedicalRecordById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: record,
    });
  }

  async getAll(req: Request, res: Response) {
    const { page, limit, patientId, veterinarianId } = req.query;
    const result = await medicalRecordService.getAllMedicalRecords({
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
      patientId: patientId as string,
      veterinarianId: veterinarianId as string,
    });
    res.status(200).json({
      status: 'success',
      ...result,
    });
  }

  async update(req: Request, res: Response) {
    const record = await medicalRecordService.updateMedicalRecord(req.params.id, req.body);
    res.status(200).json({
      status: 'success',
      data: record,
    });
  }

  async delete(req: Request, res: Response) {
    await medicalRecordService.deleteMedicalRecord(req.params.id);
    res.status(204).send();
  }
}

export default new MedicalRecordController();
