import { Request, Response } from 'express';
import medicalRecordService from '../services/medical-record.service';
import { HTTP_STATUS } from '../constants';

export class MedicalRecordController {
  async create(req: Request, res: Response): Promise<void> {
    const record = await medicalRecordService.createMedicalRecord(req.body);
    res.status(HTTP_STATUS.CREATED).json({
      status: 'success',
      data: record,
    });
  }

  async getById(req: Request, res: Response): Promise<void> {
    const record = await medicalRecordService.getMedicalRecordById(req.params.id);
    res.status(HTTP_STATUS.OK).json({
      status: 'success',
      data: record,
    });
  }

  async getAll(req: Request, res: Response): Promise<void> {
    const { page, limit, patientId, veterinarianId } = req.query;
    const result = await medicalRecordService.getAllMedicalRecords({
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
      patientId: patientId as string,
      veterinarianId: veterinarianId as string,
    });
    res.status(HTTP_STATUS.OK).json({
      status: 'success',
      ...result,
    });
  }

  async update(req: Request, res: Response): Promise<void> {
    const record = await medicalRecordService.updateMedicalRecord(req.params.id, req.body);
    res.status(HTTP_STATUS.OK).json({
      status: 'success',
      data: record,
    });
  }

  async delete(req: Request, res: Response): Promise<void> {
    await medicalRecordService.deleteMedicalRecord(req.params.id);
    res.status(HTTP_STATUS.NO_CONTENT).send();
  }
}

export default new MedicalRecordController();
