import { Router } from 'express';
import estimateController from '../controllers/estimate.controller';

const router = Router();

router.post('/', estimateController.create);
router.get('/', estimateController.getAll);
router.get('/:id', estimateController.getById);
router.post('/:id/approve', estimateController.approve);
router.post('/:id/reject', estimateController.reject);
router.post('/:id/convert', estimateController.convertToInvoice);
router.delete('/:id', estimateController.delete);

export default router;
