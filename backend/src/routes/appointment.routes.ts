import { Router } from 'express';
import appointmentController from '../controllers/appointment.controller';
import { validate, validateParams } from '../middleware/validation';
import Joi from 'joi';

const router = Router();

const createAppointmentSchema = Joi.object({
  patientId: Joi.string().uuid().required(),
  clientId: Joi.string().uuid().required(),
  veterinarianId: Joi.string().uuid().required(),
  appointmentType: Joi.string().required(),
  startTime: Joi.date().required(),
  endTime: Joi.date().required(),
  reason: Joi.string().required(),
  notes: Joi.string().optional(),
});

const updateAppointmentSchema = Joi.object({
  appointmentType: Joi.string().optional(),
  startTime: Joi.date().optional(),
  endTime: Joi.date().optional(),
  status: Joi.string().optional(),
  reason: Joi.string().optional(),
  notes: Joi.string().optional(),
});

const idParamSchema = Joi.object({
  id: Joi.string().uuid().required(),
});

/**
 * @openapi
 * /appointments:
 *   get:
 *     tags: [Appointments]
 *     summary: List appointments
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
 *     responses:
 *       200:
 *         description: Paginated list of appointments
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *   post:
 *     tags: [Appointments]
 *     summary: Create an appointment
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [patientId, clientId, veterinarianId, appointmentType, startTime, endTime, reason]
 *             properties:
 *               patientId: { type: string, format: uuid }
 *               clientId: { type: string, format: uuid }
 *               veterinarianId: { type: string, format: uuid }
 *               appointmentType: { type: string }
 *               startTime: { type: string, format: date-time }
 *               endTime: { type: string, format: date-time }
 *               reason: { type: string }
 *               notes: { type: string }
 *     responses:
 *       201: { description: Appointment created }
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *
 * /appointments/{id}:
 *   get:
 *     tags: [Appointments]
 *     summary: Get an appointment by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200: { description: Appointment found }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       404:
 *         description: Appointment not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 *   put:
 *     tags: [Appointments]
 *     summary: Update an appointment
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
 *               appointmentType: { type: string }
 *               startTime: { type: string, format: date-time }
 *               endTime: { type: string, format: date-time }
 *               status: { type: string }
 *               reason: { type: string }
 *               notes: { type: string }
 *     responses:
 *       200: { description: Appointment updated }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       404:
 *         description: Appointment not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 *   delete:
 *     tags: [Appointments]
 *     summary: Delete an appointment
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       204: { description: Appointment deleted }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       404:
 *         description: Appointment not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 *
 * /appointments/{id}/complete:
 *   patch:
 *     tags: [Appointments]
 *     summary: Mark an appointment as completed
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200: { description: Appointment completed }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       404:
 *         description: Appointment not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 */
router.post('/', validate(createAppointmentSchema), appointmentController.create);
router.get('/', appointmentController.getAll);
router.get('/:id', validateParams(idParamSchema), appointmentController.getById);
router.put(
  '/:id',
  validateParams(idParamSchema),
  validate(updateAppointmentSchema),
  appointmentController.update
);
router.patch('/:id/complete', validateParams(idParamSchema), appointmentController.complete);
router.delete('/:id', validateParams(idParamSchema), appointmentController.delete);

export default router;
