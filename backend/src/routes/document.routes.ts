import { Router } from 'express';
import documentController from '../controllers/document.controller';
import { validate, validateParams } from '../middleware/validation';
import Joi from 'joi';

const router = Router();

const createDocumentSchema = Joi.object({
  fileName: Joi.string().required(),
  fileType: Joi.string().required(),
  fileSize: Joi.number().integer().min(0).required(),
  filePath: Joi.string().required(),
  entityType: Joi.string().required(),
  entityId: Joi.string().uuid().required(),
  category: Joi.string().required(),
  description: Joi.string().optional(),
});

const updateDocumentSchema = Joi.object({
  description: Joi.string().optional(),
  category: Joi.string().optional(),
});

const idParamSchema = Joi.object({
  id: Joi.string().uuid().required(),
});

router.post('/', validate(createDocumentSchema), documentController.create);
router.get('/', documentController.getAll);
router.get('/:id', validateParams(idParamSchema), documentController.getById);
router.put('/:id', validateParams(idParamSchema), validate(updateDocumentSchema), documentController.update);
router.delete('/:id', validateParams(idParamSchema), documentController.delete);

export default router;
