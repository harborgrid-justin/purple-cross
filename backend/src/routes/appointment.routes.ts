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
