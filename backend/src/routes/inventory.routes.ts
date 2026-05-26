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

/**
 * @openapi
 * /inventory:
 *   get:
 *     tags: [Inventory]
 *     summary: List inventory items
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Paginated list of inventory items
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data: { type: array, items: { type: object } }
 *                 pagination: { $ref: '#/components/schemas/Pagination' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *   post:
 *     tags: [Inventory]
 *     summary: Create an inventory item
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, sku, category, quantity, unit, reorderPoint, unitCost]
 *             properties:
 *               name: { type: string }
 *               sku: { type: string }
 *               category: { type: string }
 *               quantity: { type: integer, minimum: 0 }
 *               unit: { type: string }
 *               reorderPoint: { type: integer, minimum: 0 }
 *               unitCost: { type: number, minimum: 0 }
 *               supplier: { type: string }
 *               expirationDate: { type: string, format: date-time }
 *     responses:
 *       201: { description: Inventory item created }
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *
 * /inventory/{id}:
 *   get:
 *     tags: [Inventory]
 *     summary: Get an inventory item by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200: { description: Inventory item found }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       404:
 *         description: Inventory item not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 *   put:
 *     tags: [Inventory]
 *     summary: Update an inventory item
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               quantity: { type: integer, minimum: 0 }
 *               reorderPoint: { type: integer, minimum: 0 }
 *               unitCost: { type: number, minimum: 0 }
 *               supplier: { type: string }
 *               expirationDate: { type: string, format: date-time }
 *     responses:
 *       200: { description: Inventory item updated }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       404:
 *         description: Inventory item not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 *   delete:
 *     tags: [Inventory]
 *     summary: Delete an inventory item
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       204: { description: Inventory item deleted }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       404:
 *         description: Inventory item not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 */
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
