import { Router } from 'express';
import patientRelationshipController from '../controllers/patient-relationship.controller';
import { validate, validateParams } from '../middleware/validation';
import Joi from 'joi';

const router = Router();

const createRelationshipSchema = Joi.object({
  patientId: Joi.string().uuid().required(),
  relatedPatientId: Joi.string().uuid().required(),
  relationshipType: Joi.string().required(),
  notes: Joi.string().optional(),
});

const updateRelationshipSchema = Joi.object({
  patientId: Joi.string().uuid().optional(),
  relatedPatientId: Joi.string().uuid().optional(),
  relationshipType: Joi.string().optional(),
  notes: Joi.string().optional(),
});

const idParamSchema = Joi.object({
  id: Joi.string().uuid().required(),
});

const patientIdParamSchema = Joi.object({
  patientId: Joi.string().uuid().required(),
});

router.post('/', validate(createRelationshipSchema), patientRelationshipController.create);
router.get('/:id', validateParams(idParamSchema), patientRelationshipController.getById);
router.get(
  '/patient/:patientId',
  validateParams(patientIdParamSchema),
  patientRelationshipController.getPatientRelationships
);
router.get(
  '/patient/:patientId/family',
  validateParams(patientIdParamSchema),
  patientRelationshipController.getPatientFamily
);
router.put(
  '/:id',
  validateParams(idParamSchema),
  validate(updateRelationshipSchema),
  patientRelationshipController.update
);
router.delete('/:id', validateParams(idParamSchema), patientRelationshipController.delete);

export default router;
