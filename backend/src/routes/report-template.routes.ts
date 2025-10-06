import { Router } from 'express';
import reportTemplateController from '../controllers/report-template.controller';
import { validate, validateParams } from '../middleware/validation';
import Joi from 'joi';

const router = Router();

const createTemplateSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().optional(),
  reportType: Joi.string().required(),
  category: Joi.string().required(),
  configuration: Joi.any().required(),
  createdBy: Joi.string().uuid().required(),
  isPublic: Joi.boolean().optional(),
});

const updateTemplateSchema = Joi.object({
  name: Joi.string().optional(),
  description: Joi.string().optional(),
  reportType: Joi.string().optional(),
  category: Joi.string().optional(),
  configuration: Joi.any().optional(),
  isPublic: Joi.boolean().optional(),
  status: Joi.string().optional(),
});

const scheduleReportSchema = Joi.object({
  templateId: Joi.string().uuid().required(),
  scheduledBy: Joi.string().uuid().required(),
  frequency: Joi.string().required(),
  nextRunDate: Joi.date().required(),
  recipients: Joi.array().items(Joi.string()).required(),
  parameters: Joi.any().optional(),
});

const idParamSchema = Joi.object({
  id: Joi.string().uuid().required(),
});

router.post('/', validate(createTemplateSchema), reportTemplateController.create);
router.get('/', reportTemplateController.getAll);
router.get('/:id', validateParams(idParamSchema), reportTemplateController.getById);
router.put(
  '/:id',
  validateParams(idParamSchema),
  validate(updateTemplateSchema),
  reportTemplateController.update
);
router.delete('/:id', validateParams(idParamSchema), reportTemplateController.delete);
router.post('/:id/use', validateParams(idParamSchema), reportTemplateController.incrementUsage);
router.post('/schedule', validate(scheduleReportSchema), reportTemplateController.scheduleReport);
router.get('/schedule/due', reportTemplateController.getScheduledReports);

export default router;
