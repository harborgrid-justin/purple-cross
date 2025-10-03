import { Router } from 'express';
import purchaseOrderController from '../controllers/purchaseOrder.controller';

const router = Router();

router.post('/', purchaseOrderController.create);
router.get('/', purchaseOrderController.getAll);
router.get('/:id', purchaseOrderController.getById);
router.post('/:id/approve', purchaseOrderController.approve);
router.post('/:id/receive', purchaseOrderController.receiveItems);
router.post('/:id/cancel', purchaseOrderController.cancel);
router.delete('/:id', purchaseOrderController.delete);

export default router;
