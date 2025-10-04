import { Router } from 'express';
import purchaseOrderController from '../controllers/purchaseOrder.controller';

const router = Router();

router.post('/', purchaseOrderController.create);
router.get('/', purchaseOrderController.getAll);
router.get('/:id', purchaseOrderController.getById);
router.put('/:id', purchaseOrderController.update);
router.delete('/:id', purchaseOrderController.delete);
router.post('/:id/approve', purchaseOrderController.approve);
router.post('/:id/receive', purchaseOrderController.receiveItems);
router.post('/:id/cancel', purchaseOrderController.cancel);

export default router;
