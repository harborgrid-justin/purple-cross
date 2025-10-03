import { Router } from 'express';
import loyaltyProgramController from '../controllers/loyaltyProgram.controller';

const router = Router();

router.post('/', loyaltyProgramController.create);
router.get('/:id', loyaltyProgramController.getById);
router.get('/client/:clientId', loyaltyProgramController.getByClient);
router.post('/points/add', loyaltyProgramController.addPoints);
router.post('/points/redeem', loyaltyProgramController.redeemPoints);
router.get('/:loyaltyProgramId/transactions', loyaltyProgramController.getTransactions);

export default router;
