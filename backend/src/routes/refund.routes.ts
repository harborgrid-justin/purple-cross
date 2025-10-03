import { Router } from 'express';
import refundController from '../controllers/refund.controller';

const router = Router();

router.post('/', refundController.create);
router.get('/', refundController.getAll);
router.get('/:id', refundController.getById);
router.post('/:id/process', refundController.process);

export default router;
