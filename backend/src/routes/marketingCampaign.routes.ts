import { Router } from 'express';
import marketingCampaignController from '../controllers/marketingCampaign.controller';

const router = Router();

router.post('/', marketingCampaignController.create);
router.get('/', marketingCampaignController.getAll);
router.get('/:id', marketingCampaignController.getById);
router.post('/:id/launch', marketingCampaignController.launch);
router.put('/:id/metrics', marketingCampaignController.updateMetrics);
router.post('/:id/complete', marketingCampaignController.complete);
router.delete('/:id', marketingCampaignController.delete);

export default router;
