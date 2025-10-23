import { Router } from 'express';
import { workflowExecutionController } from '../controllers/workflow-execution.controller';
import { validate } from '../middleware/validation';
import Joi from 'joi';

const router = Router();

// Validation schemas
const executeCustomWorkflowSchema = Joi.object({
  workflowName: Joi.string().required().min(3).max(255),
  actions: Joi.array().items(Joi.object()).min(1).required(),
  triggerData: Joi.object().optional().default({}),
});

/**
 * @route   GET /api/workflow-executions
 * @desc    Get all workflow executions
 * @access  Private
 */
router.get('/', (req, res, next) => {
  workflowExecutionController.getExecutions(req, res).catch(next);
});

/**
 * @route   GET /api/workflow-executions/stats
 * @desc    Get workflow execution statistics
 * @access  Private
 */
router.get('/stats', (req, res, next) => {
  workflowExecutionController.getExecutionStats(req, res).catch(next);
});

/**
 * @route   GET /api/workflow-executions/recent
 * @desc    Get recent workflow executions
 * @access  Private
 */
router.get('/recent', (req, res, next) => {
  workflowExecutionController.getRecentExecutions(req, res).catch(next);
});

/**
 * @route   POST /api/workflow-executions/execute
 * @desc    Execute a custom workflow
 * @access  Private
 */
router.post('/execute', validate(executeCustomWorkflowSchema), (req, res, next) => {
  workflowExecutionController.executeCustomWorkflow(req, res).catch(next);
});

/**
 * @route   GET /api/workflow-executions/:id
 * @desc    Get a workflow execution by ID
 * @access  Private
 */
router.get('/:id', (req, res, next) => {
  workflowExecutionController.getExecution(req, res).catch(next);
});

/**
 * @route   POST /api/workflow-executions/:id/cancel
 * @desc    Cancel a workflow execution
 * @access  Private
 */
router.post('/:id/cancel', (req, res, next) => {
  workflowExecutionController.cancelExecution(req, res).catch(next);
});

export default router;
