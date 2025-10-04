import { Router } from 'express';
import reportTemplateController from '../controllers/reportTemplate.controller';

const router = Router();

router.post('/', reportTemplateController.create);
router.get('/', reportTemplateController.getAll);
router.get('/:id', reportTemplateController.getById);
router.put('/:id', reportTemplateController.update);
router.delete('/:id', reportTemplateController.delete);
router.post('/:id/use', reportTemplateController.incrementUsage);
router.post('/schedule', reportTemplateController.scheduleReport);
router.get('/schedule/due', reportTemplateController.getScheduledReports);

export default router;
