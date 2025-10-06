import { Router } from 'express';
import medicalRecordController from '../controllers/medical-record.controller';
import { validate, validateParams } from '../middleware/validation';
import Joi from 'joi';

const router = Router();

const createMedicalRecordSchema = Joi.object({
  patientId: Joi.string().uuid().required(),
  veterinarianId: Joi.string().uuid().required(),
  visitDate: Joi.date().required(),
  chiefComplaint: Joi.string().required(),
  diagnosis: Joi.string().optional(),
  treatment: Joi.string().optional(),
  notes: Joi.string().optional(),
  vitalSigns: Joi.object().optional(),
});

const updateMedicalRecordSchema = Joi.object({
  visitDate: Joi.date().optional(),
  chiefComplaint: Joi.string().optional(),
  diagnosis: Joi.string().optional(),
  treatment: Joi.string().optional(),
  notes: Joi.string().optional(),
  vitalSigns: Joi.object().optional(),
});

const idParamSchema = Joi.object({
  id: Joi.string().uuid().required(),
});

router.post('/', validate(createMedicalRecordSchema), medicalRecordController.create);
router.get('/', medicalRecordController.getAll);
router.get('/:id', validateParams(idParamSchema), medicalRecordController.getById);
router.put(
  '/:id',
  validateParams(idParamSchema),
  validate(updateMedicalRecordSchema),
  medicalRecordController.update
);
router.delete('/:id', validateParams(idParamSchema), medicalRecordController.delete);

export default router;
