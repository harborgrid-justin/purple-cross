import { Router } from 'express';
import insuranceClaimController from '../controllers/insuranceClaim.controller';

const router = Router();

router.post('/', insuranceClaimController.create);
router.get('/', insuranceClaimController.getAll);
router.get('/:id', insuranceClaimController.getById);
router.put('/:id', insuranceClaimController.update);
router.delete('/:id', insuranceClaimController.delete);
router.put('/:id/status', insuranceClaimController.updateStatus);
router.post('/:id/process', insuranceClaimController.processClaim);

export default router;
