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
