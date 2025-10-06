import { Router } from 'express';
import paymentPlanController from '../controllers/payment-plan.controller';

const router = Router();

router.post('/', paymentPlanController.create);
router.get('/', paymentPlanController.getAll);
router.get('/:id', paymentPlanController.getById);
router.put('/:id', paymentPlanController.update);
router.delete('/:id', paymentPlanController.delete);
router.get('/client/:clientId/due', paymentPlanController.getDueInstallments);
router.post('/payment', paymentPlanController.recordPayment);
router.post('/:id/cancel', paymentPlanController.cancel);

export default router;
