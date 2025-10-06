import { Router } from 'express';
import marketingCampaignController from '../controllers/marketing-campaign.controller';
import { validate, validateParams } from '../middleware/validation';
import Joi from 'joi';

const router = Router();

const createCampaignSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().optional(),
  campaignType: Joi.string().required(),
  channel: Joi.array().items(Joi.string()).required(),
  targetSegment: Joi.any().optional(),
  startDate: Joi.date().required(),
  endDate: Joi.date().optional(),
  content: Joi.any().required(),
});

const updateCampaignSchema = Joi.object({
  name: Joi.string().optional(),
  description: Joi.string().optional(),
  campaignType: Joi.string().optional(),
  channel: Joi.array().items(Joi.string()).optional(),
  targetSegment: Joi.any().optional(),
  startDate: Joi.date().optional(),
  endDate: Joi.date().optional(),
  content: Joi.any().optional(),
  status: Joi.string().optional(),
});

const updateMetricsSchema = Joi.object({
  sent: Joi.number().optional(),
  delivered: Joi.number().optional(),
  opened: Joi.number().optional(),
  clicked: Joi.number().optional(),
  converted: Joi.number().optional(),
});

const idParamSchema = Joi.object({
  id: Joi.string().uuid().required(),
});

router.post('/', validate(createCampaignSchema), marketingCampaignController.create);
router.get('/', marketingCampaignController.getAll);
router.get('/:id', validateParams(idParamSchema), marketingCampaignController.getById);
router.put(
  '/:id',
  validateParams(idParamSchema),
  validate(updateCampaignSchema),
  marketingCampaignController.update
);
router.delete('/:id', validateParams(idParamSchema), marketingCampaignController.delete);
router.post('/:id/launch', validateParams(idParamSchema), marketingCampaignController.launch);
router.put(
  '/:id/metrics',
  validateParams(idParamSchema),
  validate(updateMetricsSchema),
  marketingCampaignController.updateMetrics
);
router.post('/:id/complete', validateParams(idParamSchema), marketingCampaignController.complete);

export default router;
