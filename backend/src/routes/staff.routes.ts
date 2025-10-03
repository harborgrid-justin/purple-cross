import { Router } from 'express';
import staffController from '../controllers/staff.controller';
import { validate, validateParams } from '../middleware/validation';
import Joi from 'joi';

const router = Router();

const createStaffSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
  role: Joi.string().required(),
  licenseNumber: Joi.string().optional(),
  specialization: Joi.string().optional(),
  hireDate: Joi.date().required(),
});

const updateStaffSchema = Joi.object({
  firstName: Joi.string().optional(),
  lastName: Joi.string().optional(),
  email: Joi.string().email().optional(),
  phone: Joi.string().optional(),
  role: Joi.string().optional(),
  licenseNumber: Joi.string().optional(),
  specialization: Joi.string().optional(),
  status: Joi.string().optional(),
});

const idParamSchema = Joi.object({
  id: Joi.string().uuid().required(),
});

router.post('/', validate(createStaffSchema), staffController.create);
router.get('/', staffController.getAll);
router.get('/:id', validateParams(idParamSchema), staffController.getById);
router.put('/:id', validateParams(idParamSchema), validate(updateStaffSchema), staffController.update);
router.delete('/:id', validateParams(idParamSchema), staffController.delete);

export default router;
