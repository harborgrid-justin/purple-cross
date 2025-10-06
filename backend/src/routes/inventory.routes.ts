import { Router } from 'express';
import inventoryController from '../controllers/inventory.controller';
import { validate, validateParams } from '../middleware/validation';
import Joi from 'joi';

const router = Router();

const createInventoryItemSchema = Joi.object({
  name: Joi.string().required(),
  sku: Joi.string().required(),
  category: Joi.string().required(),
  quantity: Joi.number().integer().min(0).required(),
  unit: Joi.string().required(),
  reorderPoint: Joi.number().integer().min(0).required(),
  unitCost: Joi.number().min(0).required(),
  supplier: Joi.string().optional(),
  expirationDate: Joi.date().optional(),
});

const updateInventoryItemSchema = Joi.object({
  name: Joi.string().optional(),
  quantity: Joi.number().integer().min(0).optional(),
  reorderPoint: Joi.number().integer().min(0).optional(),
  unitCost: Joi.number().min(0).optional(),
  supplier: Joi.string().optional(),
  expirationDate: Joi.date().optional(),
});

const idParamSchema = Joi.object({
  id: Joi.string().uuid().required(),
});

router.post('/', validate(createInventoryItemSchema), inventoryController.create);
router.get('/', inventoryController.getAll);
router.get('/:id', validateParams(idParamSchema), inventoryController.getById);
router.put(
  '/:id',
  validateParams(idParamSchema),
  validate(updateInventoryItemSchema),
  inventoryController.update
);
router.delete('/:id', validateParams(idParamSchema), inventoryController.delete);

export default router;
