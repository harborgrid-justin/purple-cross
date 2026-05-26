import { Router } from 'express';
import loyaltyProgramController from '../controllers/loyalty-program.controller';
import { validate, validateParams } from '../middleware/validation';
import Joi from 'joi';

const router = Router();

const createProgramSchema = Joi.object({
  clientId: Joi.string().uuid().required(),
});

const updateProgramSchema = Joi.object({
  pointsBalance: Joi.number().min(0).optional(),
  tier: Joi.string().optional(),
  lifetimePoints: Joi.number().min(0).optional(),
  lifetimeSpending: Joi.number().min(0).optional(),
});

const addPointsSchema = Joi.object({
  loyaltyProgramId: Joi.string().uuid().required(),
  points: Joi.number().positive().required(),
  transactionType: Joi.string().required(),
  referenceId: Joi.string().uuid().optional(),
  description: Joi.string().optional(),
});

const redeemPointsSchema = Joi.object({
  loyaltyProgramId: Joi.string().uuid().required(),
  points: Joi.number().positive().required(),
  description: Joi.string().required(),
});

const idParamSchema = Joi.object({
  id: Joi.string().uuid().required(),
});

const clientIdParamSchema = Joi.object({
  clientId: Joi.string().uuid().required(),
});

const loyaltyProgramIdParamSchema = Joi.object({
  loyaltyProgramId: Joi.string().uuid().required(),
});

/**
 * @openapi
 * /loyalty-programs:
 *   get:
 *     tags: [Loyalty Programs]
 *     summary: List loyalty programs
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
 *     responses:
 *       200:
 *         description: Paginated list of loyalty programs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data: { type: array, items: { type: object } }
 *                 pagination: { $ref: '#/components/schemas/Pagination' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *   post:
 *     tags: [Loyalty Programs]
 *     summary: Enroll a client in a loyalty program
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [clientId]
 *             properties:
 *               clientId: { type: string, format: uuid }
 *     responses:
 *       201: { description: Loyalty program created }
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *
 * /loyalty-programs/{id}:
 *   get:
 *     tags: [Loyalty Programs]
 *     summary: Get a loyalty program by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200: { description: Loyalty program found }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       404:
 *         description: Loyalty program not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 *   put:
 *     tags: [Loyalty Programs]
 *     summary: Update a loyalty program
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
 *               pointsBalance: { type: number, minimum: 0 }
 *               tier: { type: string }
 *               lifetimePoints: { type: number, minimum: 0 }
 *               lifetimeSpending: { type: number, minimum: 0 }
 *     responses:
 *       200: { description: Loyalty program updated }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       404:
 *         description: Loyalty program not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 *   delete:
 *     tags: [Loyalty Programs]
 *     summary: Delete a loyalty program
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       204: { description: Loyalty program deleted }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       404:
 *         description: Loyalty program not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 *
 * /loyalty-programs/client/{clientId}:
 *   get:
 *     tags: [Loyalty Programs]
 *     summary: Get the loyalty program for a client
 *     parameters:
 *       - in: path
 *         name: clientId
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200: { description: Loyalty program found }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       404:
 *         description: Loyalty program not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 *
 * /loyalty-programs/points/add:
 *   post:
 *     tags: [Loyalty Programs]
 *     summary: Add points to a loyalty program
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [loyaltyProgramId, points, transactionType]
 *             properties:
 *               loyaltyProgramId: { type: string, format: uuid }
 *               points: { type: number }
 *               transactionType: { type: string }
 *               referenceId: { type: string, format: uuid }
 *               description: { type: string }
 *     responses:
 *       200: { description: Points added }
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *
 * /loyalty-programs/points/redeem:
 *   post:
 *     tags: [Loyalty Programs]
 *     summary: Redeem points from a loyalty program
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [loyaltyProgramId, points, description]
 *             properties:
 *               loyaltyProgramId: { type: string, format: uuid }
 *               points: { type: number }
 *               description: { type: string }
 *     responses:
 *       200: { description: Points redeemed }
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *
 * /loyalty-programs/{loyaltyProgramId}/transactions:
 *   get:
 *     tags: [Loyalty Programs]
 *     summary: List point transactions for a loyalty program
 *     parameters:
 *       - in: path
 *         name: loyaltyProgramId
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200: { description: Transactions list }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 */
router.post('/', validate(createProgramSchema), loyaltyProgramController.create);
router.get('/', loyaltyProgramController.getAll);
router.get('/:id', validateParams(idParamSchema), loyaltyProgramController.getById);
router.put(
  '/:id',
  validateParams(idParamSchema),
  validate(updateProgramSchema),
  loyaltyProgramController.update
);
router.delete('/:id', validateParams(idParamSchema), loyaltyProgramController.delete);
router.get(
  '/client/:clientId',
  validateParams(clientIdParamSchema),
  loyaltyProgramController.getByClient
);
router.post('/points/add', validate(addPointsSchema), loyaltyProgramController.addPoints);
router.post('/points/redeem', validate(redeemPointsSchema), loyaltyProgramController.redeemPoints);
router.get(
  '/:loyaltyProgramId/transactions',
  validateParams(loyaltyProgramIdParamSchema),
  loyaltyProgramController.getTransactions
);

export default router;
