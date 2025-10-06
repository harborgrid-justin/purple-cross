import { Router } from 'express';
import prescriptionController from '../controllers/prescription.controller';
import { validate, validateParams } from '../middleware/validation';
import Joi from 'joi';

const router = Router();

const createPrescriptionSchema = Joi.object({
  patientId: Joi.string().uuid().required(),
  medicationId: Joi.string().uuid().required(),
  prescribedById: Joi.string().uuid().required(),
  prescriptionDate: Joi.date().required(),
  dosage: Joi.string().required(),
  frequency: Joi.string().required(),
  duration: Joi.string().required(),
  instructions: Joi.string().optional(),
  refills: Joi.number().integer().min(0).optional(),
});

const updatePrescriptionSchema = Joi.object({
  dosage: Joi.string().optional(),
  frequency: Joi.string().optional(),
  duration: Joi.string().optional(),
  instructions: Joi.string().optional(),
  refills: Joi.number().integer().min(0).optional(),
  status: Joi.string().optional(),
});

const idParamSchema = Joi.object({
  id: Joi.string().uuid().required(),
});

router.post('/', validate(createPrescriptionSchema), prescriptionController.create);
router.get('/', prescriptionController.getAll);
router.get('/:id', validateParams(idParamSchema), prescriptionController.getById);
router.put(
  '/:id',
  validateParams(idParamSchema),
  validate(updatePrescriptionSchema),
  prescriptionController.update
);
router.delete('/:id', validateParams(idParamSchema), prescriptionController.delete);

export default router;
