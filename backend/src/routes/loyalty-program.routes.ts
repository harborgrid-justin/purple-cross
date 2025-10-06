import { Router } from 'express';
import loyaltyProgramController from '../controllers/loyalty-program.controller';
import { validate, validateParams } from '../middleware/validation';
import Joi from 'joi';

const router = Router();

const createProgramSchema = Joi.object({
  clientId: Joi.string().uuid().required(),
});

const updateProgramSchema = Joi.object({
  pointsBalance: Joi.number().min(0).optional(),
  tier: Joi.string().optional(),
  lifetimePoints: Joi.number().min(0).optional(),
  lifetimeSpending: Joi.number().min(0).optional(),
});

const addPointsSchema = Joi.object({
  loyaltyProgramId: Joi.string().uuid().required(),
  points: Joi.number().positive().required(),
  transactionType: Joi.string().required(),
  referenceId: Joi.string().uuid().optional(),
  description: Joi.string().optional(),
});

const redeemPointsSchema = Joi.object({
  loyaltyProgramId: Joi.string().uuid().required(),
  points: Joi.number().positive().required(),
  description: Joi.string().required(),
});

const idParamSchema = Joi.object({
  id: Joi.string().uuid().required(),
});

const clientIdParamSchema = Joi.object({
  clientId: Joi.string().uuid().required(),
});

const loyaltyProgramIdParamSchema = Joi.object({
  loyaltyProgramId: Joi.string().uuid().required(),
});

router.post('/', validate(createProgramSchema), loyaltyProgramController.create);
router.get('/', loyaltyProgramController.getAll);
router.get('/:id', validateParams(idParamSchema), loyaltyProgramController.getById);
router.put(
  '/:id',
  validateParams(idParamSchema),
  validate(updateProgramSchema),
  loyaltyProgramController.update
);
router.delete('/:id', validateParams(idParamSchema), loyaltyProgramController.delete);
router.get(
  '/client/:clientId',
  validateParams(clientIdParamSchema),
  loyaltyProgramController.getByClient
);
router.post('/points/add', validate(addPointsSchema), loyaltyProgramController.addPoints);
router.post('/points/redeem', validate(redeemPointsSchema), loyaltyProgramController.redeemPoints);
router.get(
  '/:loyaltyProgramId/transactions',
  validateParams(loyaltyProgramIdParamSchema),
  loyaltyProgramController.getTransactions
);

export default router;
