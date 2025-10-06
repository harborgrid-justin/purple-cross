import { Router } from 'express';
import breedInfoController from '../controllers/breed-info.controller';
import { validate, validateParams } from '../middleware/validation';
import Joi from 'joi';

const router = Router();

const createBreedInfoSchema = Joi.object({
  breed: Joi.string().required(),
  species: Joi.string().required(),
  commonHealthIssues: Joi.any().optional(),
  geneticPredispositions: Joi.any().optional(),
  careGuidelines: Joi.any().optional(),
  nutritionalNeeds: Joi.any().optional(),
  averageLifespan: Joi.number().optional(),
  temperament: Joi.string().optional(),
});

const updateBreedInfoSchema = Joi.object({
  breed: Joi.string().optional(),
  species: Joi.string().optional(),
  commonHealthIssues: Joi.any().optional(),
  geneticPredispositions: Joi.any().optional(),
  careGuidelines: Joi.any().optional(),
  nutritionalNeeds: Joi.any().optional(),
  averageLifespan: Joi.number().optional(),
  temperament: Joi.string().optional(),
});

const idParamSchema = Joi.object({
  id: Joi.string().uuid().required(),
});

const breedParamSchema = Joi.object({
  breed: Joi.string().required(),
});

router.post('/', validate(createBreedInfoSchema), breedInfoController.create);
router.get('/', breedInfoController.getAll);
router.get('/breed/:breed', validateParams(breedParamSchema), breedInfoController.getByBreed);
router.get('/:id', validateParams(idParamSchema), breedInfoController.getById);
router.put(
  '/:id',
  validateParams(idParamSchema),
  validate(updateBreedInfoSchema),
  breedInfoController.update
);
router.delete('/:id', validateParams(idParamSchema), breedInfoController.delete);

export default router;
