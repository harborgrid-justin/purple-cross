import { Router } from 'express';
import communicationController from '../controllers/communication.controller';
import { validate, validateParams } from '../middleware/validation';
import Joi from 'joi';

const router = Router();

const createCommunicationSchema = Joi.object({
  clientId: Joi.string().uuid().required(),
  type: Joi.string().required(),
  subject: Joi.string().required(),
  message: Joi.string().required(),
  sentAt: Joi.date().required(),
  status: Joi.string().optional(),
});

const updateCommunicationSchema = Joi.object({
  status: Joi.string().optional(),
  readAt: Joi.date().optional(),
});

const idParamSchema = Joi.object({
  id: Joi.string().uuid().required(),
});

/**
 * @openapi
 * /communications:
 *   get:
 *     tags: [Communications]
 *     summary: List communications
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
 *     responses:
 *       200:
 *         description: Paginated list of communications
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data: { type: array, items: { type: object } }
 *                 pagination: { $ref: '#/components/schemas/Pagination' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *   post:
 *     tags: [Communications]
 *     summary: Log a communication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [clientId, type, subject, message, sentAt]
 *             properties:
 *               clientId: { type: string, format: uuid }
 *               type: { type: string }
 *               subject: { type: string }
 *               message: { type: string }
 *               sentAt: { type: string, format: date-time }
 *               status: { type: string }
 *     responses:
 *       201: { description: Communication created }
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *
 * /communications/{id}:
 *   get:
 *     tags: [Communications]
 *     summary: Get a communication by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200: { description: Communication found }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       404:
 *         description: Communication not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 *   put:
 *     tags: [Communications]
 *     summary: Update a communication
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
 *               readAt: { type: string, format: date-time }
 *     responses:
 *       200: { description: Communication updated }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       404:
 *         description: Communication not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 *   delete:
 *     tags: [Communications]
 *     summary: Delete a communication
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       204: { description: Communication deleted }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       404:
 *         description: Communication not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 */
router.post('/', validate(createCommunicationSchema), communicationController.create);
router.get('/', communicationController.getAll);
router.get('/:id', validateParams(idParamSchema), communicationController.getById);
router.put(
  '/:id',
  validateParams(idParamSchema),
  validate(updateCommunicationSchema),
  communicationController.update
);
router.delete('/:id', validateParams(idParamSchema), communicationController.delete);

export default router;
