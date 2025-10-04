import { Router } from 'express';
import feedbackController from '../controllers/feedback.controller';

const router = Router();

router.post('/', feedbackController.create);
router.get('/', feedbackController.getAll);
router.get('/nps', feedbackController.getNPSScore);
router.get('/:id', feedbackController.getById);
router.put('/:id', feedbackController.update);
router.delete('/:id', feedbackController.delete);
router.post('/:id/review', feedbackController.review);

router.post('/surveys', feedbackController.createSurvey);
router.get('/surveys/:id', feedbackController.getSurvey);
router.post('/surveys/:id/publish', feedbackController.publishSurvey);
router.post('/surveys/responses', feedbackController.submitSurveyResponse);

export default router;
