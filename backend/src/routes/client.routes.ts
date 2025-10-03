import { Router } from 'express';
import clientController from '../controllers/client.controller';
import { validate, validateParams } from '../middleware/validation';
import Joi from 'joi';

const router = Router();

const createClientSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
  alternatePhone: Joi.string().optional(),
  address: Joi.string().required(),
  city: Joi.string().required(),
  state: Joi.string().required(),
  zipCode: Joi.string().required(),
  emergencyContact: Joi.string().optional(),
  emergencyPhone: Joi.string().optional(),
  preferredContact: Joi.string().optional(),
});

const updateClientSchema = Joi.object({
  firstName: Joi.string().optional(),
  lastName: Joi.string().optional(),
  email: Joi.string().email().optional(),
  phone: Joi.string().optional(),
  alternatePhone: Joi.string().optional(),
  address: Joi.string().optional(),
  city: Joi.string().optional(),
  state: Joi.string().optional(),
  zipCode: Joi.string().optional(),
  emergencyContact: Joi.string().optional(),
  emergencyPhone: Joi.string().optional(),
  preferredContact: Joi.string().optional(),
  status: Joi.string().optional(),
});

const idParamSchema = Joi.object({
  id: Joi.string().uuid().required(),
});

router.post('/', validate(createClientSchema), clientController.create);
router.get('/', clientController.getAll);
router.get('/:id', validateParams(idParamSchema), clientController.getById);
router.put('/:id', validateParams(idParamSchema), validate(updateClientSchema), clientController.update);
router.delete('/:id', validateParams(idParamSchema), clientController.delete);

export default router;
