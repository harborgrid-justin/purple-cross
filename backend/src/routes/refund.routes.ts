import { Router } from 'express';
import refundController from '../controllers/refund.controller';
import { validate, validateParams } from '../middleware/validation';
import Joi from 'joi';

const router = Router();

const createRefundSchema = Joi.object({
  clientId: Joi.string().uuid().required(),
  invoiceId: Joi.string().uuid().optional(),
  paymentId: Joi.string().uuid().optional(),
  amount: Joi.number().positive().required(),
  reason: Joi.string().required(),
  refundMethod: Joi.string().required(),
  processedBy: Joi.string().uuid().required(),
});

const updateRefundSchema = Joi.object({
  clientId: Joi.string().uuid().optional(),
  invoiceId: Joi.string().uuid().optional(),
  paymentId: Joi.string().uuid().optional(),
  amount: Joi.number().positive().optional(),
  reason: Joi.string().optional(),
  refundMethod: Joi.string().optional(),
  processedBy: Joi.string().uuid().optional(),
  status: Joi.string().optional(),
});

const idParamSchema = Joi.object({
  id: Joi.string().uuid().required(),
});

router.post('/', validate(createRefundSchema), refundController.create);
router.get('/', refundController.getAll);
router.get('/:id', validateParams(idParamSchema), refundController.getById);
router.put(
  '/:id',
  validateParams(idParamSchema),
  validate(updateRefundSchema),
  refundController.update
);
router.delete('/:id', validateParams(idParamSchema), refundController.delete);
router.post('/:id/process', validateParams(idParamSchema), refundController.process);

export default router;
