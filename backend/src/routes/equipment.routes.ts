import { Router } from 'express';
import equipmentController from '../controllers/equipment.controller';

const router = Router();

router.post('/', equipmentController.create);
router.get('/', equipmentController.getAll);
router.get('/:id', equipmentController.getById);
router.put('/:id', equipmentController.update);
router.post('/maintenance', equipmentController.scheduleMaintenance);
router.post('/maintenance/:maintenanceId/complete', equipmentController.completeMaintenance);
router.get('/maintenance/schedule', equipmentController.getMaintenanceSchedule);
router.get('/maintenance/upcoming', equipmentController.getUpcomingMaintenance);
router.delete('/:id', equipmentController.delete);

export default router;
