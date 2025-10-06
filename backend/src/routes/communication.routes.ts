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
