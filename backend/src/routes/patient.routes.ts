import { Router } from 'express';
import patientController from '../controllers/patient.controller';
import { validate, validateParams } from '../middleware/validation';
import Joi from 'joi';

const router = Router();

const createPatientSchema = Joi.object({
  name: Joi.string().required(),
  species: Joi.string().required(),
  breed: Joi.string().optional(),
  dateOfBirth: Joi.date().required(),
  gender: Joi.string().required(),
  color: Joi.string().optional(),
  weight: Joi.number().optional(),
  microchipId: Joi.string().optional(),
  insuranceProvider: Joi.string().optional(),
  insurancePolicy: Joi.string().optional(),
  ownerId: Joi.string().uuid().required(),
});

const updatePatientSchema = Joi.object({
  name: Joi.string().optional(),
  species: Joi.string().optional(),
  breed: Joi.string().optional(),
  dateOfBirth: Joi.date().optional(),
  gender: Joi.string().optional(),
  color: Joi.string().optional(),
  weight: Joi.number().optional(),
  microchipId: Joi.string().optional(),
  insuranceProvider: Joi.string().optional(),
  insurancePolicy: Joi.string().optional(),
  status: Joi.string().optional(),
});

const idParamSchema = Joi.object({
  id: Joi.string().uuid().required(),
});

router.post('/', validate(createPatientSchema), patientController.create);
router.get('/', patientController.getAll);
router.get('/:id', validateParams(idParamSchema), patientController.getById);
router.put('/:id', validateParams(idParamSchema), validate(updatePatientSchema), patientController.update);
router.delete('/:id', validateParams(idParamSchema), patientController.delete);

export default router;
