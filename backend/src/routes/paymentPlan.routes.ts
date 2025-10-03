import { Router } from 'express';
import paymentPlanController from '../controllers/paymentPlan.controller';

const router = Router();

router.post('/', paymentPlanController.create);
router.get('/', paymentPlanController.getAll);
router.get('/:id', paymentPlanController.getById);
router.get('/client/:clientId/due', paymentPlanController.getDueInstallments);
router.post('/payment', paymentPlanController.recordPayment);
router.post('/:id/cancel', paymentPlanController.cancel);

export default router;
