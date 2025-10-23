import { Router } from 'express';
import { workflowController } from '../controllers/workflow.controller';
import { validate } from '../middleware/validation';
import Joi from 'joi';

const router = Router();

// Validation schemas
const createWorkflowSchema = Joi.object({
  documentId: Joi.string().required(),
  workflowName: Joi.string().required().min(3).max(255),
  steps: Joi.object().required(),
  currentStep: Joi.number().integer().min(1).optional(),
  totalSteps: Joi.number().integer().min(1).required(),
});

const updateWorkflowSchema = Joi.object({
  currentStep: Joi.number().integer().min(1).optional(),
  status: Joi.string().valid('in_progress', 'completed', 'cancelled', 'failed').optional(),
  steps: Joi.object().optional(),
}).min(1);

/**
 * @route   POST /api/workflows
 * @desc    Create a new workflow
 * @access  Private
 */
router.post('/', validate(createWorkflowSchema), (req, res, next) => {
  workflowController.createWorkflow(req, res).catch(next);
});

/**
 * @route   GET /api/workflows
 * @desc    Get all workflows
 * @access  Private
 */
router.get('/', (req, res, next) => {
  workflowController.getWorkflows(req, res).catch(next);
});

/**
 * @route   GET /api/workflows/stats
 * @desc    Get workflow statistics
 * @access  Private
 */
router.get('/stats', (req, res, next) => {
  workflowController.getWorkflowStats(req, res).catch(next);
});

/**
 * @route   GET /api/workflows/document/:documentId
 * @desc    Get workflows by document ID
 * @access  Private
 */
router.get('/document/:documentId', (req, res, next) => {
  workflowController.getWorkflowsByDocument(req, res).catch(next);
});

/**
 * @route   GET /api/workflows/:id
 * @desc    Get a workflow by ID
 * @access  Private
 */
router.get('/:id', (req, res, next) => {
  workflowController.getWorkflow(req, res).catch(next);
});

/**
 * @route   PUT /api/workflows/:id
 * @desc    Update a workflow
 * @access  Private
 */
router.put('/:id', validate(updateWorkflowSchema), (req, res, next) => {
  workflowController.updateWorkflow(req, res).catch(next);
});

/**
 * @route   POST /api/workflows/:id/advance
 * @desc    Advance workflow to next step
 * @access  Private
 */
router.post('/:id/advance', (req, res, next) => {
  workflowController.advanceWorkflow(req, res).catch(next);
});

/**
 * @route   POST /api/workflows/:id/cancel
 * @desc    Cancel a workflow
 * @access  Private
 */
router.post('/:id/cancel', (req, res, next) => {
  workflowController.cancelWorkflow(req, res).catch(next);
});

export default router;
