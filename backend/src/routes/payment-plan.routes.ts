import { Router } from 'express';
import paymentPlanController from '../controllers/payment-plan.controller';
import { validate, validateParams } from '../middleware/validation';
import Joi from 'joi';

const router = Router();

const createPaymentPlanSchema = Joi.object({
  clientId: Joi.string().uuid().required(),
  invoiceId: Joi.string().uuid().optional(),
  totalAmount: Joi.number().positive().required(),
  downPayment: Joi.number().min(0).optional(),
  installmentAmount: Joi.number().positive().required(),
  installmentFrequency: Joi.string().required(),
  numberOfInstallments: Joi.number().positive().integer().required(),
  interestRate: Joi.number().min(0).optional(),
  startDate: Joi.date().required(),
});

const updatePaymentPlanSchema = Joi.object({
  installmentAmount: Joi.number().positive().optional(),
  installmentFrequency: Joi.string().optional(),
  status: Joi.string().optional(),
});

const recordPaymentSchema = Joi.object({
  paymentPlanId: Joi.string().uuid().required(),
  installmentNumber: Joi.number().positive().integer().required(),
  amount: Joi.number().positive().required(),
  paymentDate: Joi.date().required(),
  paymentMethod: Joi.string().required(),
});

const idParamSchema = Joi.object({
  id: Joi.string().uuid().required(),
});

const clientIdParamSchema = Joi.object({
  clientId: Joi.string().uuid().required(),
});

router.post('/', validate(createPaymentPlanSchema), paymentPlanController.create);
router.get('/', paymentPlanController.getAll);
router.get('/:id', validateParams(idParamSchema), paymentPlanController.getById);
router.put(
  '/:id',
  validateParams(idParamSchema),
  validate(updatePaymentPlanSchema),
  paymentPlanController.update
);
router.delete('/:id', validateParams(idParamSchema), paymentPlanController.delete);
router.get(
  '/client/:clientId/due',
  validateParams(clientIdParamSchema),
  paymentPlanController.getDueInstallments
);
router.post('/payment', validate(recordPaymentSchema), paymentPlanController.recordPayment);
router.post('/:id/cancel', validateParams(idParamSchema), paymentPlanController.cancel);

export default router;
