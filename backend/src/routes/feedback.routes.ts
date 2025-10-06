import { Router } from 'express';
import feedbackController from '../controllers/feedback.controller';
import { validate, validateParams } from '../middleware/validation';
import Joi from 'joi';

const router = Router();

const createFeedbackSchema = Joi.object({
  clientId: Joi.string().uuid().required(),
  feedbackType: Joi.string().required(),
  rating: Joi.number().min(1).max(5).optional(),
  comment: Joi.string().optional(),
  relatedType: Joi.string().optional(),
  relatedId: Joi.string().uuid().optional(),
  npsScore: Joi.number().min(0).max(10).optional(),
});

const updateFeedbackSchema = Joi.object({
  feedbackType: Joi.string().optional(),
  rating: Joi.number().min(1).max(5).optional(),
  comment: Joi.string().optional(),
  status: Joi.string().optional(),
});

const createSurveySchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().optional(),
  questions: Joi.any().required(),
});

const submitResponseSchema = Joi.object({
  surveyId: Joi.string().uuid().required(),
  clientId: Joi.string().uuid().required(),
  responses: Joi.any().required(),
});

const reviewSchema = Joi.object({
  reviewedBy: Joi.string().uuid().required(),
  reviewNotes: Joi.string().optional(),
  status: Joi.string().required(),
});

const idParamSchema = Joi.object({
  id: Joi.string().uuid().required(),
});

router.post('/', validate(createFeedbackSchema), feedbackController.create);
router.get('/', feedbackController.getAll);
router.get('/nps', feedbackController.getNPSScore);
router.get('/:id', validateParams(idParamSchema), feedbackController.getById);
router.put(
  '/:id',
  validateParams(idParamSchema),
  validate(updateFeedbackSchema),
  feedbackController.update
);
router.delete('/:id', validateParams(idParamSchema), feedbackController.delete);
router.post(
  '/:id/review',
  validateParams(idParamSchema),
  validate(reviewSchema),
  feedbackController.review
);

router.post('/surveys', validate(createSurveySchema), feedbackController.createSurvey);
router.get('/surveys/:id', validateParams(idParamSchema), feedbackController.getSurvey);
router.post(
  '/surveys/:id/publish',
  validateParams(idParamSchema),
  feedbackController.publishSurvey
);
router.post(
  '/surveys/responses',
  validate(submitResponseSchema),
  feedbackController.submitSurveyResponse
);

export default router;
