import { Router } from 'express';
import waitlistController from '../controllers/waitlist.controller';
import { validate, validateParams } from '../middleware/validation';
import Joi from 'joi';

const router = Router();

const createWaitlistSchema = Joi.object({
  patientId: Joi.string().uuid().required(),
  clientId: Joi.string().uuid().required(),
  appointmentType: Joi.string().required(),
  preferredDate: Joi.date().optional(),
  preferredTime: Joi.string().optional(),
  priority: Joi.number().optional(),
  urgency: Joi.string().optional(),
  reason: Joi.string().required(),
  notes: Joi.string().optional(),
});

const updateWaitlistSchema = Joi.object({
  patientId: Joi.string().uuid().optional(),
  clientId: Joi.string().uuid().optional(),
  appointmentType: Joi.string().optional(),
  preferredDate: Joi.date().optional(),
  preferredTime: Joi.string().optional(),
  priority: Joi.number().optional(),
  urgency: Joi.string().optional(),
  reason: Joi.string().optional(),
  notes: Joi.string().optional(),
  status: Joi.string().optional(),
});

const idParamSchema = Joi.object({
  id: Joi.string().uuid().required(),
});

/**
 * @openapi
 * /waitlist:
 *   get:
 *     tags: [Waitlist]
 *     summary: List waitlist entries
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
 *       - in: query
 *         name: status
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Paginated list of waitlist entries
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data: { type: array, items: { type: object } }
 *                 pagination: { $ref: '#/components/schemas/Pagination' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *   post:
 *     tags: [Waitlist]
 *     summary: Add an entry to the waitlist
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [patientId, clientId, appointmentType, reason]
 *             properties:
 *               patientId: { type: string, format: uuid }
 *               clientId: { type: string, format: uuid }
 *               appointmentType: { type: string }
 *               preferredDate: { type: string, format: date-time }
 *               preferredTime: { type: string }
 *               priority: { type: number }
 *               urgency: { type: string }
 *               reason: { type: string }
 *               notes: { type: string }
 *     responses:
 *       201: { description: Waitlist entry created }
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *
 * /waitlist/{id}:
 *   get:
 *     tags: [Waitlist]
 *     summary: Get a waitlist entry by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200: { description: Waitlist entry found }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       404:
 *         description: Waitlist entry not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 *   put:
 *     tags: [Waitlist]
 *     summary: Update a waitlist entry
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
 *               clientId: { type: string, format: uuid }
 *               appointmentType: { type: string }
 *               preferredDate: { type: string, format: date-time }
 *               preferredTime: { type: string }
 *               priority: { type: number }
 *               urgency: { type: string }
 *               reason: { type: string }
 *               notes: { type: string }
 *               status: { type: string }
 *     responses:
 *       200: { description: Waitlist entry updated }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       404:
 *         description: Waitlist entry not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 *   delete:
 *     tags: [Waitlist]
 *     summary: Delete a waitlist entry
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       204: { description: Waitlist entry deleted }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       404:
 *         description: Waitlist entry not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 *
 * /waitlist/{id}/notify:
 *   post:
 *     tags: [Waitlist]
 *     summary: Notify a waitlisted client of an opening
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200: { description: Client notified }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       404:
 *         description: Waitlist entry not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 *
 * /waitlist/{id}/book:
 *   post:
 *     tags: [Waitlist]
 *     summary: Book an appointment from a waitlist entry
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200: { description: Appointment booked }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       404:
 *         description: Waitlist entry not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 *
 * /waitlist/{id}/cancel:
 *   post:
 *     tags: [Waitlist]
 *     summary: Cancel a waitlist entry
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200: { description: Waitlist entry cancelled }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       404:
 *         description: Waitlist entry not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 */
router.post('/', validate(createWaitlistSchema), waitlistController.create);
router.get('/', waitlistController.getAll);
router.get('/:id', validateParams(idParamSchema), waitlistController.getById);
router.put(
  '/:id',
  validateParams(idParamSchema),
  validate(updateWaitlistSchema),
  waitlistController.update
);
router.delete('/:id', validateParams(idParamSchema), waitlistController.delete);
router.post('/:id/notify', validateParams(idParamSchema), waitlistController.notify);
router.post('/:id/book', validateParams(idParamSchema), waitlistController.book);
router.post('/:id/cancel', validateParams(idParamSchema), waitlistController.cancel);

export default router;
