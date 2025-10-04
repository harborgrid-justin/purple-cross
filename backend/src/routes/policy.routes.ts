import { Router } from 'express';
import policyController from '../controllers/policy.controller';

const router = Router();

router.post('/', policyController.create);
router.get('/', policyController.getAll);
router.get('/:id', policyController.getById);
router.put('/:id', policyController.update);
router.delete('/:id', policyController.delete);
router.post('/:id/acknowledge', policyController.acknowledge);
router.get('/user/:userId/acknowledgments', policyController.getUserAcknowledgments);

export default router;
