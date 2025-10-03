import { Request, Response } from 'express';
import patientRelationshipService from '../services/patientRelationship.service';

export class PatientRelationshipController {
  async create(req: Request, res: Response) {
    const relationship = await patientRelationshipService.createRelationship(req.body);
    res.status(201).json({ status: 'success', data: relationship });
  }

  async getById(req: Request, res: Response) {
    const relationship = await patientRelationshipService.getRelationship(req.params.id);
    res.status(200).json({ status: 'success', data: relationship });
  }

  async getPatientRelationships(req: Request, res: Response) {
    const relationships = await patientRelationshipService.getPatientRelationships(req.params.patientId);
    res.status(200).json({ status: 'success', data: relationships });
  }

  async getPatientFamily(req: Request, res: Response) {
    const family = await patientRelationshipService.getPatientFamily(req.params.patientId);
    res.status(200).json({ status: 'success', data: family });
  }

  async update(req: Request, res: Response) {
    const relationship = await patientRelationshipService.updateRelationship(req.params.id, req.body);
    res.status(200).json({ status: 'success', data: relationship });
  }

  async delete(req: Request, res: Response) {
    await patientRelationshipService.deleteRelationship(req.params.id);
    res.status(204).send();
  }
}

export default new PatientRelationshipController();
