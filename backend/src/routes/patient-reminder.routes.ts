import { Router } from 'express';
import patientReminderController from '../controllers/patient-reminder.controller';
import { validate, validateParams } from '../middleware/validation';
import Joi from 'joi';

const router = Router();

const createReminderSchema = Joi.object({
  patientId: Joi.string().uuid().required(),
  reminderType: Joi.string().required(),
  reminderDate: Joi.date().required(),
  description: Joi.string().required(),
  recurring: Joi.boolean().optional(),
  frequency: Joi.string().optional(),
});

const updateReminderSchema = Joi.object({
  patientId: Joi.string().uuid().optional(),
  reminderType: Joi.string().optional(),
  reminderDate: Joi.date().optional(),
  description: Joi.string().optional(),
  recurring: Joi.boolean().optional(),
  frequency: Joi.string().optional(),
  status: Joi.string().optional(),
});

const idParamSchema = Joi.object({
  id: Joi.string().uuid().required(),
});

/**
 * @openapi
 * /patient-reminders:
 *   get:
 *     tags: [Patient Reminders]
 *     summary: List patient reminders
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
 *       - in: query
 *         name: patientId
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Paginated list of reminders
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data: { type: array, items: { type: object } }
 *                 pagination: { $ref: '#/components/schemas/Pagination' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *   post:
 *     tags: [Patient Reminders]
 *     summary: Create a patient reminder
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [patientId, reminderType, reminderDate, description]
 *             properties:
 *               patientId: { type: string, format: uuid }
 *               reminderType: { type: string }
 *               reminderDate: { type: string, format: date-time }
 *               description: { type: string }
 *               recurring: { type: boolean }
 *               frequency: { type: string }
 *     responses:
 *       201: { description: Reminder created }
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *
 * /patient-reminders/due:
 *   get:
 *     tags: [Patient Reminders]
 *     summary: List reminders that are currently due
 *     responses:
 *       200: { description: Due reminders }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *
 * /patient-reminders/{id}:
 *   get:
 *     tags: [Patient Reminders]
 *     summary: Get a reminder by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200: { description: Reminder found }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       404:
 *         description: Reminder not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 *   put:
 *     tags: [Patient Reminders]
 *     summary: Update a reminder
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
 *               patientId: { type: string, format: uuid }
 *               reminderType: { type: string }
 *               reminderDate: { type: string, format: date-time }
 *               description: { type: string }
 *               recurring: { type: boolean }
 *               frequency: { type: string }
 *               status: { type: string }
 *     responses:
 *       200: { description: Reminder updated }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       404:
 *         description: Reminder not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 *   delete:
 *     tags: [Patient Reminders]
 *     summary: Delete a reminder
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       204: { description: Reminder deleted }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       404:
 *         description: Reminder not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 *
 * /patient-reminders/{id}/complete:
 *   post:
 *     tags: [Patient Reminders]
 *     summary: Mark a reminder as completed
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200: { description: Reminder completed }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       404:
 *         description: Reminder not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 */
router.post('/', validate(createReminderSchema), patientReminderController.create);
router.get('/', patientReminderController.getAll);
router.get('/due', patientReminderController.getDue);
router.get('/:id', validateParams(idParamSchema), patientReminderController.getById);
router.put(
  '/:id',
  validateParams(idParamSchema),
  validate(updateReminderSchema),
  patientReminderController.update
);
router.post('/:id/complete', validateParams(idParamSchema), patientReminderController.complete);
router.delete('/:id', validateParams(idParamSchema), patientReminderController.delete);

export default router;
