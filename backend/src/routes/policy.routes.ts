import { Router } from 'express';
import policyController from '../controllers/policy.controller';
import { validate, validateParams } from '../middleware/validation';
import Joi from 'joi';

const router = Router();

const createPolicySchema = Joi.object({
  title: Joi.string().required(),
  category: Joi.string().required(),
  content: Joi.string().required(),
  version: Joi.string().required(),
  effectiveDate: Joi.date().required(),
  reviewDate: Joi.date().optional(),
});

const updatePolicySchema = Joi.object({
  title: Joi.string().optional(),
  category: Joi.string().optional(),
  content: Joi.string().optional(),
  version: Joi.string().optional(),
  effectiveDate: Joi.date().optional(),
  reviewDate: Joi.date().optional(),
  status: Joi.string().optional(),
});

const idParamSchema = Joi.object({
  id: Joi.string().uuid().required(),
});

const userIdParamSchema = Joi.object({
  userId: Joi.string().uuid().required(),
});

router.post('/', validate(createPolicySchema), policyController.create);
router.get('/', policyController.getAll);
router.get('/:id', validateParams(idParamSchema), policyController.getById);
router.put(
  '/:id',
  validateParams(idParamSchema),
  validate(updatePolicySchema),
  policyController.update
);
router.delete('/:id', validateParams(idParamSchema), policyController.delete);
router.post('/:id/acknowledge', validateParams(idParamSchema), policyController.acknowledge);
router.get(
  '/user/:userId/acknowledgments',
  validateParams(userIdParamSchema),
  policyController.getUserAcknowledgments
);

export default router;
