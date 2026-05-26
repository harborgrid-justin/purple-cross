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

/**
 * @openapi
 * /feedback:
 *   get:
 *     tags: [Feedback]
 *     summary: List feedback entries
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
 *       - in: query
 *         name: clientId
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Paginated list of feedback
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data: { type: array, items: { type: object } }
 *                 pagination: { $ref: '#/components/schemas/Pagination' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *   post:
 *     tags: [Feedback]
 *     summary: Submit feedback
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [clientId, feedbackType]
 *             properties:
 *               clientId: { type: string, format: uuid }
 *               feedbackType: { type: string }
 *               rating: { type: number, minimum: 1, maximum: 5 }
 *               comment: { type: string }
 *               relatedType: { type: string }
 *               relatedId: { type: string, format: uuid }
 *               npsScore: { type: number, minimum: 0, maximum: 10 }
 *     responses:
 *       201: { description: Feedback created }
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *
 * /feedback/nps:
 *   get:
 *     tags: [Feedback]
 *     summary: Get the aggregate Net Promoter Score
 *     responses:
 *       200: { description: NPS score }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *
 * /feedback/{id}:
 *   get:
 *     tags: [Feedback]
 *     summary: Get a feedback entry by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200: { description: Feedback found }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       404:
 *         description: Feedback not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 *   put:
 *     tags: [Feedback]
 *     summary: Update a feedback entry
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               feedbackType: { type: string }
 *               rating: { type: number, minimum: 1, maximum: 5 }
 *               comment: { type: string }
 *               status: { type: string }
 *     responses:
 *       200: { description: Feedback updated }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       404:
 *         description: Feedback not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 *   delete:
 *     tags: [Feedback]
 *     summary: Delete a feedback entry
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       204: { description: Feedback deleted }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       404:
 *         description: Feedback not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 *
 * /feedback/{id}/review:
 *   post:
 *     tags: [Feedback]
 *     summary: Review a feedback entry
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [reviewedBy, status]
 *             properties:
 *               reviewedBy: { type: string, format: uuid }
 *               reviewNotes: { type: string }
 *               status: { type: string }
 *     responses:
 *       200: { description: Feedback reviewed }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       404:
 *         description: Feedback not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 *
 * /feedback/surveys:
 *   post:
 *     tags: [Feedback]
 *     summary: Create a survey
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, questions]
 *             properties:
 *               title: { type: string }
 *               description: { type: string }
 *               questions: {}
 *     responses:
 *       201: { description: Survey created }
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *
 * /feedback/surveys/{id}:
 *   get:
 *     tags: [Feedback]
 *     summary: Get a survey by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200: { description: Survey found }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       404:
 *         description: Survey not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 *
 * /feedback/surveys/{id}/publish:
 *   post:
 *     tags: [Feedback]
 *     summary: Publish a survey
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200: { description: Survey published }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       404:
 *         description: Survey not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 *
 * /feedback/surveys/responses:
 *   post:
 *     tags: [Feedback]
 *     summary: Submit a survey response
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [surveyId, clientId, responses]
 *             properties:
 *               surveyId: { type: string, format: uuid }
 *               clientId: { type: string, format: uuid }
 *               responses: {}
 *     responses:
 *       201: { description: Survey response submitted }
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 */
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
