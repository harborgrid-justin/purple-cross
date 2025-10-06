import { Router } from 'express';
import equipmentController from '../controllers/equipment.controller';
import { validate, validateParams } from '../middleware/validation';
import Joi from 'joi';

const router = Router();

const createEquipmentSchema = Joi.object({
  name: Joi.string().required(),
  category: Joi.string().required(),
  manufacturer: Joi.string().optional(),
  modelNumber: Joi.string().optional(),
  serialNumber: Joi.string().optional(),
  purchaseDate: Joi.date().optional(),
  purchasePrice: Joi.number().positive().optional(),
  warrantyExpiration: Joi.date().optional(),
  location: Joi.string().optional(),
});

const updateEquipmentSchema = Joi.object({
  name: Joi.string().optional(),
  category: Joi.string().optional(),
  manufacturer: Joi.string().optional(),
  modelNumber: Joi.string().optional(),
  serialNumber: Joi.string().optional(),
  purchaseDate: Joi.date().optional(),
  purchasePrice: Joi.number().positive().optional(),
  warrantyExpiration: Joi.date().optional(),
  location: Joi.string().optional(),
  status: Joi.string().optional(),
});

const maintenanceSchema = Joi.object({
  equipmentId: Joi.string().uuid().required(),
  maintenanceType: Joi.string().required(),
  scheduledDate: Joi.date().required(),
  description: Joi.string().optional(),
  assignedTo: Joi.string().uuid().optional(),
});

const idParamSchema = Joi.object({
  id: Joi.string().uuid().required(),
});

const maintenanceIdParamSchema = Joi.object({
  maintenanceId: Joi.string().uuid().required(),
});

router.post('/', validate(createEquipmentSchema), equipmentController.create);
router.get('/', equipmentController.getAll);
router.get('/:id', validateParams(idParamSchema), equipmentController.getById);
router.put(
  '/:id',
  validateParams(idParamSchema),
  validate(updateEquipmentSchema),
  equipmentController.update
);
router.post('/maintenance', validate(maintenanceSchema), equipmentController.scheduleMaintenance);
router.post(
  '/maintenance/:maintenanceId/complete',
  validateParams(maintenanceIdParamSchema),
  equipmentController.completeMaintenance
);
router.get('/maintenance/schedule', equipmentController.getMaintenanceSchedule);
router.get('/maintenance/upcoming', equipmentController.getUpcomingMaintenance);
router.delete('/:id', validateParams(idParamSchema), equipmentController.delete);

export default router;
