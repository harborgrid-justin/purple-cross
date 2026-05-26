import { Router } from 'express';
import staffController from '../controllers/staff.controller';
import { validate, validateParams } from '../middleware/validation';
import Joi from 'joi';

const router = Router();

const createStaffSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
  role: Joi.string().required(),
  licenseNumber: Joi.string().optional(),
  specialization: Joi.string().optional(),
  hireDate: Joi.date().required(),
});

const updateStaffSchema = Joi.object({
  firstName: Joi.string().optional(),
  lastName: Joi.string().optional(),
  email: Joi.string().email().optional(),
  phone: Joi.string().optional(),
  role: Joi.string().optional(),
  licenseNumber: Joi.string().optional(),
  specialization: Joi.string().optional(),
  status: Joi.string().optional(),
});

const idParamSchema = Joi.object({
  id: Joi.string().uuid().required(),
});

/**
 * @openapi
 * /staff:
 *   get:
 *     tags: [Staff]
 *     summary: List staff members
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
 *       - in: query
 *         name: role
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Paginated list of staff
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data: { type: array, items: { type: object } }
 *                 pagination: { $ref: '#/components/schemas/Pagination' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *   post:
 *     tags: [Staff]
 *     summary: Create a staff member
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [firstName, lastName, email, phone, role, hireDate]
 *             properties:
 *               firstName: { type: string }
 *               lastName: { type: string }
 *               email: { type: string, format: email }
 *               phone: { type: string }
 *               role: { type: string }
 *               licenseNumber: { type: string }
 *               specialization: { type: string }
 *               hireDate: { type: string, format: date-time }
 *     responses:
 *       201: { description: Staff member created }
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *
 * /staff/{id}:
 *   get:
 *     tags: [Staff]
 *     summary: Get a staff member by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200: { description: Staff member found }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       404:
 *         description: Staff member not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 *   put:
 *     tags: [Staff]
 *     summary: Update a staff member
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
 *               firstName: { type: string }
 *               lastName: { type: string }
 *               email: { type: string, format: email }
 *               phone: { type: string }
 *               role: { type: string }
 *               licenseNumber: { type: string }
 *               specialization: { type: string }
 *               status: { type: string }
 *     responses:
 *       200: { description: Staff member updated }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       404:
 *         description: Staff member not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 *   delete:
 *     tags: [Staff]
 *     summary: Delete a staff member
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       204: { description: Staff member deleted }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       404:
 *         description: Staff member not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 */
router.post('/', validate(createStaffSchema), staffController.create);
router.get('/', staffController.getAll);
router.get('/:id', validateParams(idParamSchema), staffController.getById);
router.put(
  '/:id',
  validateParams(idParamSchema),
  validate(updateStaffSchema),
  staffController.update
);
router.delete('/:id', validateParams(idParamSchema), staffController.delete);

export default router;
