import { Router } from 'express';
import { workflowTemplateController } from '../controllers/workflow-template.controller';
import { validate } from '../middleware/validation';
import Joi from 'joi';

const router = Router();

// Validation schemas
const createTemplateSchema = Joi.object({
  name: Joi.string().required().min(3).max(255),
  description: Joi.string().optional().max(1000),
  category: Joi.string().optional().default('general'),
  triggerType: Joi.string().valid('event', 'schedule', 'manual').required(),
  triggerConfig: Joi.object().required(),
  actions: Joi.array().items(Joi.object()).min(1).required(),
  isPublic: Joi.boolean().optional(),
});

const updateTemplateSchema = Joi.object({
  name: Joi.string().min(3).max(255).optional(),
  description: Joi.string().max(1000).optional(),
  category: Joi.string().optional(),
  triggerType: Joi.string().valid('event', 'schedule', 'manual').optional(),
  triggerConfig: Joi.object().optional(),
  actions: Joi.array().items(Joi.object()).min(1).optional(),
  isActive: Joi.boolean().optional(),
  isPublic: Joi.boolean().optional(),
}).min(1);

const executeTemplateSchema = Joi.object({
  triggerData: Joi.object().optional().default({}),
});

/**
 * @route   POST /api/workflow-templates
 * @desc    Create a new workflow template
 * @access  Private
 */
router.post('/', validate(createTemplateSchema), (req, res, next) => {
  workflowTemplateController.createTemplate(req, res).catch(next);
});

/**
 * @route   GET /api/workflow-templates
 * @desc    Get all workflow templates
 * @access  Private
 */
router.get('/', (req, res, next) => {
  workflowTemplateController.getTemplates(req, res).catch(next);
});

/**
 * @route   GET /api/workflow-templates/popular
 * @desc    Get popular workflow templates
 * @access  Private
 */
router.get('/popular', (req, res, next) => {
  workflowTemplateController.getPopularTemplates(req, res).catch(next);
});

/**
 * @route   GET /api/workflow-templates/categories
 * @desc    Get workflow template categories
 * @access  Private
 */
router.get('/categories', (req, res, next) => {
  workflowTemplateController.getCategories(req, res).catch(next);
});

/**
 * @route   GET /api/workflow-templates/category/:category
 * @desc    Get templates by category
 * @access  Private
 */
router.get('/category/:category', (req, res, next) => {
  workflowTemplateController.getTemplatesByCategory(req, res).catch(next);
});

/**
 * @route   GET /api/workflow-templates/:id
 * @desc    Get a workflow template by ID
 * @access  Private
 */
router.get('/:id', (req, res, next) => {
  workflowTemplateController.getTemplate(req, res).catch(next);
});

/**
 * @route   PUT /api/workflow-templates/:id
 * @desc    Update a workflow template
 * @access  Private
 */
router.put('/:id', validate(updateTemplateSchema), (req, res, next) => {
  workflowTemplateController.updateTemplate(req, res).catch(next);
});

/**
 * @route   DELETE /api/workflow-templates/:id
 * @desc    Delete a workflow template
 * @access  Private
 */
router.delete('/:id', (req, res, next) => {
  workflowTemplateController.deleteTemplate(req, res).catch(next);
});

/**
 * @route   POST /api/workflow-templates/:id/execute
 * @desc    Execute a workflow template
 * @access  Private
 */
router.post('/:id/execute', validate(executeTemplateSchema), (req, res, next) => {
  workflowTemplateController.executeTemplate(req, res).catch(next);
});

export default router;
