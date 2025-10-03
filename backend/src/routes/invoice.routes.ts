import { Router } from 'express';
import invoiceController from '../controllers/invoice.controller';
import { validate, validateParams } from '../middleware/validation';
import Joi from 'joi';

const router = Router();

const createInvoiceSchema = Joi.object({
  clientId: Joi.string().uuid().required(),
  invoiceNumber: Joi.string().required(),
  invoiceDate: Joi.date().required(),
  dueDate: Joi.date().required(),
  subtotal: Joi.number().min(0).required(),
  tax: Joi.number().min(0).optional(),
  total: Joi.number().min(0).required(),
  notes: Joi.string().optional(),
});

const updateInvoiceSchema = Joi.object({
  status: Joi.string().optional(),
  notes: Joi.string().optional(),
});

const idParamSchema = Joi.object({
  id: Joi.string().uuid().required(),
});

router.post('/', validate(createInvoiceSchema), invoiceController.create);
router.get('/', invoiceController.getAll);
router.get('/:id', validateParams(idParamSchema), invoiceController.getById);
router.put('/:id', validateParams(idParamSchema), validate(updateInvoiceSchema), invoiceController.update);
router.delete('/:id', validateParams(idParamSchema), invoiceController.delete);

export default router;
