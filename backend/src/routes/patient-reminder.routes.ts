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
