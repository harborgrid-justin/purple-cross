import { Router } from 'express';
import labTestController from '../controllers/lab-test.controller';
import { validate, validateParams } from '../middleware/validation';
import Joi from 'joi';

const router = Router();

const createLabTestSchema = Joi.object({
  patientId: Joi.string().uuid().required(),
  orderedById: Joi.string().uuid().required(),
  testName: Joi.string().required(),
  testType: Joi.string().required(),
  orderDate: Joi.date().required(),
  notes: Joi.string().optional(),
});

const updateLabTestSchema = Joi.object({
  status: Joi.string().optional(),
  results: Joi.object().optional(),
  completedDate: Joi.date().optional(),
  notes: Joi.string().optional(),
});

const idParamSchema = Joi.object({
  id: Joi.string().uuid().required(),
});

/**
 * @openapi
 * /lab-tests:
 *   get:
 *     tags: [Lab Tests]
 *     summary: List lab tests
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
 *       - in: query
 *         name: patientId
 *         schema: { type: string, format: uuid }
 *       - in: query
 *         name: status
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Paginated list of lab tests
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data: { type: array, items: { type: object } }
 *                 pagination: { $ref: '#/components/schemas/Pagination' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *   post:
 *     tags: [Lab Tests]
 *     summary: Order a lab test
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [patientId, orderedById, testName, testType, orderDate]
 *             properties:
 *               patientId: { type: string, format: uuid }
 *               orderedById: { type: string, format: uuid }
 *               testName: { type: string }
 *               testType: { type: string }
 *               orderDate: { type: string, format: date-time }
 *               notes: { type: string }
 *     responses:
 *       201: { description: Lab test created }
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *
 * /lab-tests/{id}:
 *   get:
 *     tags: [Lab Tests]
 *     summary: Get a lab test by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200: { description: Lab test found }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       404:
 *         description: Lab test not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 *   put:
 *     tags: [Lab Tests]
 *     summary: Update a lab test (e.g. record results)
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
 *               status: { type: string }
 *               results: { type: object }
 *               completedDate: { type: string, format: date-time }
 *               notes: { type: string }
 *     responses:
 *       200: { description: Lab test updated }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       404:
 *         description: Lab test not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 *   delete:
 *     tags: [Lab Tests]
 *     summary: Delete a lab test
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       204: { description: Lab test deleted }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       404:
 *         description: Lab test not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 */
router.post('/', validate(createLabTestSchema), labTestController.create);
router.get('/', labTestController.getAll);
router.get('/:id', validateParams(idParamSchema), labTestController.getById);
router.put(
  '/:id',
  validateParams(idParamSchema),
  validate(updateLabTestSchema),
  labTestController.update
);
router.delete('/:id', validateParams(idParamSchema), labTestController.delete);

export default router;
