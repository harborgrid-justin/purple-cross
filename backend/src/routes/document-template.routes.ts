import { Router } from 'express';
import documentTemplateController from '../controllers/document-template.controller';
import { validate, validateParams } from '../middleware/validation';
import Joi from 'joi';

const router = Router();

const createTemplateSchema = Joi.object({
  name: Joi.string().required(),
  category: Joi.string().required(),
  template: Joi.any().required(),
  fields: Joi.any().optional(),
});

const updateTemplateSchema = Joi.object({
  name: Joi.string().optional(),
  category: Joi.string().optional(),
  template: Joi.any().optional(),
  fields: Joi.any().optional(),
  status: Joi.string().optional(),
});

const signDocumentSchema = Joi.object({
  documentId: Joi.string().uuid().required(),
  signedBy: Joi.string().uuid().required(),
  signatureData: Joi.string().required(),
  ipAddress: Joi.string().optional(),
});

const createWorkflowSchema = Joi.object({
  documentId: Joi.string().uuid().required(),
  workflowType: Joi.string().required(),
  steps: Joi.any().required(),
  currentStep: Joi.number().optional(),
});

const advanceWorkflowSchema = Joi.object({
  actionedBy: Joi.string().uuid().required(),
  action: Joi.string().required(),
  notes: Joi.string().optional(),
});

const idParamSchema = Joi.object({
  id: Joi.string().uuid().required(),
});

const documentIdParamSchema = Joi.object({
  documentId: Joi.string().uuid().required(),
});

const workflowIdParamSchema = Joi.object({
  workflowId: Joi.string().uuid().required(),
});

router.post('/', validate(createTemplateSchema), documentTemplateController.create);
router.get('/', documentTemplateController.getAll);
router.get('/:id', validateParams(idParamSchema), documentTemplateController.getById);
router.put(
  '/:id',
  validateParams(idParamSchema),
  validate(updateTemplateSchema),
  documentTemplateController.update
);
router.delete('/:id', validateParams(idParamSchema), documentTemplateController.delete);
router.post('/:id/use', validateParams(idParamSchema), documentTemplateController.incrementUsage);
router.post('/signatures', validate(signDocumentSchema), documentTemplateController.signDocument);
router.get(
  '/documents/:documentId/signatures',
  validateParams(documentIdParamSchema),
  documentTemplateController.getDocumentSignatures
);
router.post(
  '/workflows',
  validate(createWorkflowSchema),
  documentTemplateController.createWorkflow
);
router.post(
  '/workflows/:workflowId/advance',
  validateParams(workflowIdParamSchema),
  validate(advanceWorkflowSchema),
  documentTemplateController.advanceWorkflow
);

export default router;
