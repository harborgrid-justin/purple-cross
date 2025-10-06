import { Router } from 'express';
import insuranceClaimController from '../controllers/insurance-claim.controller';
import { validate, validateParams } from '../middleware/validation';
import Joi from 'joi';

const router = Router();

const createClaimSchema = Joi.object({
  patientId: Joi.string().uuid().required(),
  clientId: Joi.string().uuid().required(),
  insuranceProvider: Joi.string().required(),
  policyNumber: Joi.string().required(),
  serviceDate: Joi.date().required(),
  diagnosisCodes: Joi.array().items(Joi.string()).required(),
  procedureCodes: Joi.array().items(Joi.string()).required(),
  claimAmount: Joi.number().positive().required(),
});

const updateClaimSchema = Joi.object({
  patientId: Joi.string().uuid().optional(),
  clientId: Joi.string().uuid().optional(),
  insuranceProvider: Joi.string().optional(),
  policyNumber: Joi.string().optional(),
  serviceDate: Joi.date().optional(),
  diagnosisCodes: Joi.array().items(Joi.string()).optional(),
  procedureCodes: Joi.array().items(Joi.string()).optional(),
  claimAmount: Joi.number().positive().optional(),
  status: Joi.string().optional(),
});

const idParamSchema = Joi.object({
  id: Joi.string().uuid().required(),
});

const updateStatusSchema = Joi.object({
  status: Joi.string().required(),
});

router.post('/', validate(createClaimSchema), insuranceClaimController.create);
router.get('/', insuranceClaimController.getAll);
router.get('/:id', validateParams(idParamSchema), insuranceClaimController.getById);
router.put(
  '/:id',
  validateParams(idParamSchema),
  validate(updateClaimSchema),
  insuranceClaimController.update
);
router.delete('/:id', validateParams(idParamSchema), insuranceClaimController.delete);
router.put(
  '/:id/status',
  validateParams(idParamSchema),
  validate(updateStatusSchema),
  insuranceClaimController.updateStatus
);
router.post('/:id/process', validateParams(idParamSchema), insuranceClaimController.processClaim);

export default router;
