import { Router } from 'express';
import clientPortalController from '../controllers/client-portal.controller';
import { validate, validateParams } from '../middleware/validation';
import Joi from 'joi';

const router = Router();

const createPortalAccessSchema = Joi.object({
  clientId: Joi.string().uuid().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const updatePortalAccessSchema = Joi.object({
  email: Joi.string().email().optional(),
  status: Joi.string().optional(),
});

const updatePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().min(8).required(),
});

const idParamSchema = Joi.object({
  id: Joi.string().uuid().required(),
});

router.post('/', validate(createPortalAccessSchema), clientPortalController.create);
router.post('/login', validate(loginSchema), clientPortalController.login);
router.get('/:id', validateParams(idParamSchema), clientPortalController.getById);
router.put(
  '/:id',
  validateParams(idParamSchema),
  validate(updatePortalAccessSchema),
  clientPortalController.update
);
router.delete('/:id', validateParams(idParamSchema), clientPortalController.delete);
router.put(
  '/:id/password',
  validateParams(idParamSchema),
  validate(updatePasswordSchema),
  clientPortalController.updatePassword
);
router.post(
  '/:id/2fa/enable',
  validateParams(idParamSchema),
  clientPortalController.enableTwoFactor
);
router.post(
  '/:id/2fa/disable',
  validateParams(idParamSchema),
  clientPortalController.disableTwoFactor
);

export default router;
