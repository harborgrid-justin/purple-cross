import { Router } from 'express';
import estimateController from '../controllers/estimate.controller';
import { validate, validateParams } from '../middleware/validation';
import Joi from 'joi';

const router = Router();

const lineItemSchema = Joi.object({
  description: Joi.string().required(),
  quantity: Joi.number().positive().required(),
  unitPrice: Joi.number().min(0).required(),
  itemType: Joi.string().required(),
  itemId: Joi.string().uuid().optional(),
});

const createEstimateSchema = Joi.object({
  clientId: Joi.string().uuid().required(),
  patientId: Joi.string().uuid().optional(),
  title: Joi.string().required(),
  description: Joi.string().optional(),
  lineItems: Joi.array().items(lineItemSchema).min(1).required(),
  validUntil: Joi.date().required(),
  notes: Joi.string().optional(),
});

const updateEstimateSchema = Joi.object({
  clientId: Joi.string().uuid().optional(),
  patientId: Joi.string().uuid().optional(),
  title: Joi.string().optional(),
  description: Joi.string().optional(),
  lineItems: Joi.array().items(lineItemSchema).optional(),
  validUntil: Joi.date().optional(),
  notes: Joi.string().optional(),
  status: Joi.string().optional(),
});

const idParamSchema = Joi.object({
  id: Joi.string().uuid().required(),
});

router.post('/', validate(createEstimateSchema), estimateController.create);
router.get('/', estimateController.getAll);
router.get('/:id', validateParams(idParamSchema), estimateController.getById);
router.put(
  '/:id',
  validateParams(idParamSchema),
  validate(updateEstimateSchema),
  estimateController.update
);
router.delete('/:id', validateParams(idParamSchema), estimateController.delete);
router.post('/:id/approve', validateParams(idParamSchema), estimateController.approve);
router.post('/:id/reject', validateParams(idParamSchema), estimateController.reject);
router.post('/:id/convert', validateParams(idParamSchema), estimateController.convertToInvoice);

export default router;
