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

/**
 * @openapi
 * /estimates:
 *   get:
 *     tags: [Estimates]
 *     summary: List estimates
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
 *       - in: query
 *         name: clientId
 *         schema: { type: string, format: uuid }
 *       - in: query
 *         name: status
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Paginated list of estimates
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data: { type: array, items: { type: object } }
 *                 pagination: { $ref: '#/components/schemas/Pagination' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *   post:
 *     tags: [Estimates]
 *     summary: Create an estimate
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [clientId, title, lineItems, validUntil]
 *             properties:
 *               clientId: { type: string, format: uuid }
 *               patientId: { type: string, format: uuid }
 *               title: { type: string }
 *               description: { type: string }
 *               lineItems:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required: [description, quantity, unitPrice, itemType]
 *                   properties:
 *                     description: { type: string }
 *                     quantity: { type: number }
 *                     unitPrice: { type: number, minimum: 0 }
 *                     itemType: { type: string }
 *                     itemId: { type: string, format: uuid }
 *               validUntil: { type: string, format: date-time }
 *               notes: { type: string }
 *     responses:
 *       201: { description: Estimate created }
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *
 * /estimates/{id}:
 *   get:
 *     tags: [Estimates]
 *     summary: Get an estimate by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200: { description: Estimate found }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       404:
 *         description: Estimate not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 *   put:
 *     tags: [Estimates]
 *     summary: Update an estimate
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
 *               clientId: { type: string, format: uuid }
 *               patientId: { type: string, format: uuid }
 *               title: { type: string }
 *               description: { type: string }
 *               lineItems: { type: array, items: { type: object } }
 *               validUntil: { type: string, format: date-time }
 *               notes: { type: string }
 *               status: { type: string }
 *     responses:
 *       200: { description: Estimate updated }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       404:
 *         description: Estimate not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 *   delete:
 *     tags: [Estimates]
 *     summary: Delete an estimate
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       204: { description: Estimate deleted }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       404:
 *         description: Estimate not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 *
 * /estimates/{id}/approve:
 *   post:
 *     tags: [Estimates]
 *     summary: Approve an estimate
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200: { description: Estimate approved }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       404:
 *         description: Estimate not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 *
 * /estimates/{id}/reject:
 *   post:
 *     tags: [Estimates]
 *     summary: Reject an estimate
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200: { description: Estimate rejected }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       404:
 *         description: Estimate not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 *
 * /estimates/{id}/convert:
 *   post:
 *     tags: [Estimates]
 *     summary: Convert an estimate to an invoice
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200: { description: Estimate converted to invoice }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       404:
 *         description: Estimate not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 */
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
