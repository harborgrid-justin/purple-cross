import { Router } from 'express';
import purchaseOrderController from '../controllers/purchase-order.controller';
import { validate, validateParams } from '../middleware/validation';
import Joi from 'joi';

const router = Router();

const lineItemSchema = Joi.object({
  itemType: Joi.string().required(),
  itemId: Joi.string().uuid().optional(),
  description: Joi.string().required(),
  quantityOrdered: Joi.number().positive().integer().required(),
  unitCost: Joi.number().min(0).required(),
});

const createPurchaseOrderSchema = Joi.object({
  vendor: Joi.string().required(),
  vendorContact: Joi.string().optional(),
  expectedDate: Joi.date().optional(),
  lineItems: Joi.array().items(lineItemSchema).min(1).required(),
  notes: Joi.string().optional(),
});

const updatePurchaseOrderSchema = Joi.object({
  vendor: Joi.string().optional(),
  vendorContact: Joi.string().optional(),
  expectedDate: Joi.date().optional(),
  lineItems: Joi.array().items(lineItemSchema).optional(),
  notes: Joi.string().optional(),
  status: Joi.string().optional(),
});

const receiveItemsSchema = Joi.object({
  receivedItems: Joi.array()
    .items(
      Joi.object({
        lineItemId: Joi.string().uuid().required(),
        quantityReceived: Joi.number().positive().integer().required(),
      })
    )
    .required(),
  receivedDate: Joi.date().required(),
});

const idParamSchema = Joi.object({
  id: Joi.string().uuid().required(),
});

router.post('/', validate(createPurchaseOrderSchema), purchaseOrderController.create);
router.get('/', purchaseOrderController.getAll);
router.get('/:id', validateParams(idParamSchema), purchaseOrderController.getById);
router.put(
  '/:id',
  validateParams(idParamSchema),
  validate(updatePurchaseOrderSchema),
  purchaseOrderController.update
);
router.delete('/:id', validateParams(idParamSchema), purchaseOrderController.delete);
router.post('/:id/approve', validateParams(idParamSchema), purchaseOrderController.approve);
router.post(
  '/:id/receive',
  validateParams(idParamSchema),
  validate(receiveItemsSchema),
  purchaseOrderController.receiveItems
);
router.post('/:id/cancel', validateParams(idParamSchema), purchaseOrderController.cancel);

export default router;
