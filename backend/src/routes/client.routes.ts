import { Router } from 'express';
import clientController from '../controllers/client.controller';
import { validate, validateParams } from '../middleware/validation';
import Joi from 'joi';

const router = Router();

const createClientSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
  alternatePhone: Joi.string().optional(),
  address: Joi.string().required(),
  city: Joi.string().required(),
  state: Joi.string().required(),
  zipCode: Joi.string().required(),
  emergencyContact: Joi.string().optional(),
  emergencyPhone: Joi.string().optional(),
  preferredContact: Joi.string().optional(),
});

const updateClientSchema = Joi.object({
  firstName: Joi.string().optional(),
  lastName: Joi.string().optional(),
  email: Joi.string().email().optional(),
  phone: Joi.string().optional(),
  alternatePhone: Joi.string().optional(),
  address: Joi.string().optional(),
  city: Joi.string().optional(),
  state: Joi.string().optional(),
  zipCode: Joi.string().optional(),
  emergencyContact: Joi.string().optional(),
  emergencyPhone: Joi.string().optional(),
  preferredContact: Joi.string().optional(),
  status: Joi.string().optional(),
});

const idParamSchema = Joi.object({
  id: Joi.string().uuid().required(),
});

/**
 * @openapi
 * /clients:
 *   get:
 *     tags: [Clients]
 *     summary: List clients
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Paginated list of clients
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/Client' }
 *                 pagination: { $ref: '#/components/schemas/Pagination' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *   post:
 *     tags: [Clients]
 *     summary: Create a client
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [firstName, lastName, email, phone, address, city, state, zipCode]
 *             properties:
 *               firstName: { type: string }
 *               lastName: { type: string }
 *               email: { type: string, format: email }
 *               phone: { type: string }
 *               alternatePhone: { type: string }
 *               address: { type: string }
 *               city: { type: string }
 *               state: { type: string }
 *               zipCode: { type: string }
 *               emergencyContact: { type: string }
 *               emergencyPhone: { type: string }
 *               preferredContact: { type: string }
 *     responses:
 *       201:
 *         description: Client created
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Client' }
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *
 * /clients/{id}:
 *   get:
 *     tags: [Clients]
 *     summary: Get a client by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Client found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Client' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       404:
 *         description: Client not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 *   put:
 *     tags: [Clients]
 *     summary: Update a client
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
 *               alternatePhone: { type: string }
 *               address: { type: string }
 *               city: { type: string }
 *               state: { type: string }
 *               zipCode: { type: string }
 *               emergencyContact: { type: string }
 *               emergencyPhone: { type: string }
 *               preferredContact: { type: string }
 *               status: { type: string }
 *     responses:
 *       200:
 *         description: Client updated
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Client' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       404:
 *         description: Client not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 *   delete:
 *     tags: [Clients]
 *     summary: Delete a client
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       204: { description: Client deleted }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       404:
 *         description: Client not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 */
router.post('/', validate(createClientSchema), clientController.create);
router.get('/', clientController.getAll);
router.get('/:id', validateParams(idParamSchema), clientController.getById);
router.put(
  '/:id',
  validateParams(idParamSchema),
  validate(updateClientSchema),
  clientController.update
);
router.delete('/:id', validateParams(idParamSchema), clientController.delete);

export default router;
