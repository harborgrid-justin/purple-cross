import { Request, Response } from 'express';
import patientRelationshipService from '../services/patient-relationship.service';
import { HTTP_STATUS } from '../constants';

export class PatientRelationshipController {
  async create(req: Request, res: Response): Promise<void> {
    const relationship = await patientRelationshipService.createRelationship(req.body);
    res.status(HTTP_STATUS.CREATED).json({ status: 'success', data: relationship });
  }

  async getById(req: Request, res: Response): Promise<void> {
    const relationship = await patientRelationshipService.getRelationship(req.params.id);
    res.status(HTTP_STATUS.OK).json({ status: 'success', data: relationship });
  }

  async getPatientRelationships(req: Request, res: Response): Promise<void> {
    const relationships = await patientRelationshipService.getPatientRelationships(
      req.params.patientId
    );
    res.status(HTTP_STATUS.OK).json({ status: 'success', data: relationships });
  }

  async getPatientFamily(req: Request, res: Response): Promise<void> {
    const family = await patientRelationshipService.getPatientFamily(req.params.patientId);
    res.status(HTTP_STATUS.OK).json({ status: 'success', data: family });
  }

  async update(req: Request, res: Response): Promise<void> {
    const relationship = await patientRelationshipService.updateRelationship(
      req.params.id,
      req.body
    );
    res.status(HTTP_STATUS.OK).json({ status: 'success', data: relationship });
  }

  async delete(req: Request, res: Response): Promise<void> {
    await patientRelationshipService.deleteRelationship(req.params.id);
    res.status(HTTP_STATUS.NO_CONTENT).send();
  }
}

export default new PatientRelationshipController();
