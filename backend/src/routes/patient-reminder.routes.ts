import { Router } from 'express';
import patientReminderController from '../controllers/patient-reminder.controller';

const router = Router();

router.post('/', patientReminderController.create);
router.get('/', patientReminderController.getAll);
router.get('/due', patientReminderController.getDue);
router.get('/:id', patientReminderController.getById);
router.put('/:id', patientReminderController.update);
router.post('/:id/complete', patientReminderController.complete);
router.delete('/:id', patientReminderController.delete);

export default router;
