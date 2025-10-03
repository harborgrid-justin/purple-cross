import { Router } from 'express';
import labTestController from '../controllers/labTest.controller';
import { validate, validateParams } from '../middleware/validation';
import Joi from 'joi';

const router = Router();

const createLabTestSchema = Joi.object({
  patientId: Joi.string().uuid().required(),
  orderedById: Joi.string().uuid().required(),
  testName: Joi.string().required(),
  testType: Joi.string().required(),
  orderDate: Joi.date().required(),
  notes: Joi.string().optional(),
});

const updateLabTestSchema = Joi.object({
  status: Joi.string().optional(),
  results: Joi.object().optional(),
  completedDate: Joi.date().optional(),
  notes: Joi.string().optional(),
});

const idParamSchema = Joi.object({
  id: Joi.string().uuid().required(),
});

router.post('/', validate(createLabTestSchema), labTestController.create);
router.get('/', labTestController.getAll);
router.get('/:id', validateParams(idParamSchema), labTestController.getById);
router.put('/:id', validateParams(idParamSchema), validate(updateLabTestSchema), labTestController.update);
router.delete('/:id', validateParams(idParamSchema), labTestController.delete);

export default router;
