import { Router } from 'express';
import marketingCampaignController from '../controllers/marketingCampaign.controller';

const router = Router();

router.post('/', marketingCampaignController.create);
router.get('/', marketingCampaignController.getAll);
router.get('/:id', marketingCampaignController.getById);
router.put('/:id', marketingCampaignController.update);
router.delete('/:id', marketingCampaignController.delete);
router.post('/:id/launch', marketingCampaignController.launch);
router.put('/:id/metrics', marketingCampaignController.updateMetrics);
router.post('/:id/complete', marketingCampaignController.complete);

export default router;
