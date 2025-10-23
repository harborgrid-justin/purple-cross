import { Router } from 'express';
import { webhookController } from '../controllers/webhook.controller';
import { validate } from '../middleware/validation';
import Joi from 'joi';

const router = Router();

// Validation schemas
const createWebhookSchema = Joi.object({
  name: Joi.string().required().min(3).max(255),
  url: Joi.string().uri().required(),
  events: Joi.array().items(Joi.string()).min(1).required(),
  active: Joi.boolean().optional(),
});

const updateWebhookSchema = Joi.object({
  name: Joi.string().min(3).max(255).optional(),
  url: Joi.string().uri().optional(),
  events: Joi.array().items(Joi.string()).min(1).optional(),
  active: Joi.boolean().optional(),
}).min(1);

/**
 * @route   POST /api/webhooks
 * @desc    Create a new webhook subscription
 * @access  Private
 */
router.post('/', validate(createWebhookSchema), (req, res, next) => {
  webhookController.createWebhook(req, res).catch(next);
});

/**
 * @route   GET /api/webhooks
 * @desc    Get all webhook subscriptions
 * @access  Private
 */
router.get('/', (req, res, next) => {
  webhookController.getWebhooks(req, res).catch(next);
});

/**
 * @route   GET /api/webhooks/:id
 * @desc    Get a webhook subscription by ID
 * @access  Private
 */
router.get('/:id', (req, res, next) => {
  webhookController.getWebhook(req, res).catch(next);
});

/**
 * @route   PUT /api/webhooks/:id
 * @desc    Update a webhook subscription
 * @access  Private
 */
router.put('/:id', validate(updateWebhookSchema), (req, res, next) => {
  webhookController.updateWebhook(req, res).catch(next);
});

/**
 * @route   DELETE /api/webhooks/:id
 * @desc    Delete a webhook subscription
 * @access  Private
 */
router.delete('/:id', (req, res, next) => {
  webhookController.deleteWebhook(req, res).catch(next);
});

/**
 * @route   POST /api/webhooks/:id/regenerate-secret
 * @desc    Regenerate webhook secret
 * @access  Private
 */
router.post('/:id/regenerate-secret', (req, res, next) => {
  webhookController.regenerateSecret(req, res).catch(next);
});

/**
 * @route   POST /api/webhooks/:id/test
 * @desc    Test webhook delivery
 * @access  Private
 */
router.post('/:id/test', (req, res, next) => {
  webhookController.testWebhook(req, res).catch(next);
});

/**
 * @route   GET /api/webhooks/:id/deliveries
 * @desc    Get webhook deliveries for a specific webhook
 * @access  Private
 */
router.get('/:id/deliveries', (req, res, next) => {
  webhookController.getWebhookDeliveries(req, res).catch(next);
});

/**
 * @route   GET /api/webhooks/:id/stats
 * @desc    Get webhook delivery statistics
 * @access  Private
 */
router.get('/:id/stats', (req, res, next) => {
  webhookController.getWebhookStats(req, res).catch(next);
});

/**
 * @route   GET /api/webhooks/deliveries/all
 * @desc    Get all webhook deliveries (admin)
 * @access  Private
 */
router.get('/deliveries/all', (req, res, next) => {
  webhookController.getAllDeliveries(req, res).catch(next);
});

/**
 * @route   GET /api/webhooks/analytics
 * @desc    Get webhook delivery analytics
 * @access  Private
 */
router.get('/analytics', (req, res, next) => {
  webhookController.getDeliveryAnalytics(req, res).catch(next);
});

export default router;
