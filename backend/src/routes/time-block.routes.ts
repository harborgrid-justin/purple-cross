import { Router } from 'express';
import timeBlockController from '../controllers/time-block.controller';
import { validate, validateParams } from '../middleware/validation';
import Joi from 'joi';

const router = Router();

const createTimeBlockSchema = Joi.object({
  staffId: Joi.string().uuid().required(),
  blockType: Joi.string().required(),
  title: Joi.string().required(),
  startTime: Joi.date().required(),
  endTime: Joi.date().required(),
  recurring: Joi.boolean().optional(),
  recurrenceRule: Joi.string().optional(),
  notes: Joi.string().optional(),
});

const updateTimeBlockSchema = Joi.object({
  staffId: Joi.string().uuid().optional(),
  blockType: Joi.string().optional(),
  title: Joi.string().optional(),
  startTime: Joi.date().optional(),
  endTime: Joi.date().optional(),
  recurring: Joi.boolean().optional(),
  recurrenceRule: Joi.string().optional(),
  notes: Joi.string().optional(),
});

const idParamSchema = Joi.object({
  id: Joi.string().uuid().required(),
});

/**
 * @openapi
 * /time-blocks:
 *   get:
 *     tags: [Time Blocks]
 *     summary: List time blocks
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
 *       - in: query
 *         name: staffId
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Paginated list of time blocks
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data: { type: array, items: { type: object } }
 *                 pagination: { $ref: '#/components/schemas/Pagination' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *   post:
 *     tags: [Time Blocks]
 *     summary: Create a time block
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [staffId, blockType, title, startTime, endTime]
 *             properties:
 *               staffId: { type: string, format: uuid }
 *               blockType: { type: string }
 *               title: { type: string }
 *               startTime: { type: string, format: date-time }
 *               endTime: { type: string, format: date-time }
 *               recurring: { type: boolean }
 *               recurrenceRule: { type: string }
 *               notes: { type: string }
 *     responses:
 *       201: { description: Time block created }
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *
 * /time-blocks/{id}:
 *   get:
 *     tags: [Time Blocks]
 *     summary: Get a time block by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200: { description: Time block found }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       404:
 *         description: Time block not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 *   put:
 *     tags: [Time Blocks]
 *     summary: Update a time block
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
 *               staffId: { type: string, format: uuid }
 *               blockType: { type: string }
 *               title: { type: string }
 *               startTime: { type: string, format: date-time }
 *               endTime: { type: string, format: date-time }
 *               recurring: { type: boolean }
 *               recurrenceRule: { type: string }
 *               notes: { type: string }
 *     responses:
 *       200: { description: Time block updated }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       404:
 *         description: Time block not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 *   delete:
 *     tags: [Time Blocks]
 *     summary: Delete a time block
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       204: { description: Time block deleted }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       404:
 *         description: Time block not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 */
router.post('/', validate(createTimeBlockSchema), timeBlockController.create);
router.get('/', timeBlockController.getAll);
router.get('/:id', validateParams(idParamSchema), timeBlockController.getById);
router.put(
  '/:id',
  validateParams(idParamSchema),
  validate(updateTimeBlockSchema),
  timeBlockController.update
);
router.delete('/:id', validateParams(idParamSchema), timeBlockController.delete);

export default router;
