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
