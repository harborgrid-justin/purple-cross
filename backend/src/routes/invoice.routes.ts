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

/**
 * @openapi
 * /invoices:
 *   get:
 *     tags: [Invoices]
 *     summary: List invoices
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
 *         description: Paginated list of invoices
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data: { type: array, items: { type: object } }
 *                 pagination: { $ref: '#/components/schemas/Pagination' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *   post:
 *     tags: [Invoices]
 *     summary: Create an invoice
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [clientId, invoiceNumber, invoiceDate, dueDate, subtotal, total]
 *             properties:
 *               clientId: { type: string, format: uuid }
 *               invoiceNumber: { type: string }
 *               invoiceDate: { type: string, format: date-time }
 *               dueDate: { type: string, format: date-time }
 *               subtotal: { type: number, minimum: 0 }
 *               tax: { type: number, minimum: 0 }
 *               total: { type: number, minimum: 0 }
 *               notes: { type: string }
 *     responses:
 *       201: { description: Invoice created }
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *
 * /invoices/{id}:
 *   get:
 *     tags: [Invoices]
 *     summary: Get an invoice by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200: { description: Invoice found }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       404:
 *         description: Invoice not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 *   put:
 *     tags: [Invoices]
 *     summary: Update an invoice
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
 *               status: { type: string }
 *               notes: { type: string }
 *     responses:
 *       200: { description: Invoice updated }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       404:
 *         description: Invoice not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 *   delete:
 *     tags: [Invoices]
 *     summary: Delete an invoice
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       204: { description: Invoice deleted }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       404:
 *         description: Invoice not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 */
router.post('/', validate(createInvoiceSchema), invoiceController.create);
router.get('/', invoiceController.getAll);
router.get('/:id', validateParams(idParamSchema), invoiceController.getById);
router.put(
  '/:id',
  validateParams(idParamSchema),
  validate(updateInvoiceSchema),
  invoiceController.update
);
router.delete('/:id', validateParams(idParamSchema), invoiceController.delete);

export default router;
