import { Router } from 'express';
import clientPortalController from '../controllers/client-portal.controller';
import { validate, validateParams } from '../middleware/validation';
import Joi from 'joi';

const router = Router();

const createPortalAccessSchema = Joi.object({
  clientId: Joi.string().uuid().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const updatePortalAccessSchema = Joi.object({
  email: Joi.string().email().optional(),
  status: Joi.string().optional(),
});

const updatePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().min(8).required(),
});

const idParamSchema = Joi.object({
  id: Joi.string().uuid().required(),
});

/**
 * @openapi
 * /client-portal:
 *   post:
 *     tags: [Client Portal]
 *     summary: Provision portal access for a client (public)
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [clientId, email, password]
 *             properties:
 *               clientId: { type: string, format: uuid }
 *               email: { type: string, format: email }
 *               password: { type: string, minLength: 8 }
 *     responses:
 *       201: { description: Portal access created }
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 *
 * /client-portal/login:
 *   post:
 *     tags: [Client Portal]
 *     summary: Authenticate a client portal user (public)
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, format: email }
 *               password: { type: string }
 *     responses:
 *       200: { description: Authenticated }
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 *
 * /client-portal/{id}:
 *   get:
 *     tags: [Client Portal]
 *     summary: Get portal access by ID (public)
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200: { description: Portal access found }
 *       404:
 *         description: Portal access not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 *   put:
 *     tags: [Client Portal]
 *     summary: Update portal access (public)
 *     security: []
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
 *               email: { type: string, format: email }
 *               status: { type: string }
 *     responses:
 *       200: { description: Portal access updated }
 *       404:
 *         description: Portal access not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 *   delete:
 *     tags: [Client Portal]
 *     summary: Delete portal access (public)
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       204: { description: Portal access deleted }
 *       404:
 *         description: Portal access not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 *
 * /client-portal/{id}/password:
 *   put:
 *     tags: [Client Portal]
 *     summary: Change a portal user's password (public)
 *     security: []
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
 *             required: [currentPassword, newPassword]
 *             properties:
 *               currentPassword: { type: string }
 *               newPassword: { type: string, minLength: 8 }
 *     responses:
 *       200: { description: Password updated }
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 *
 * /client-portal/{id}/2fa/enable:
 *   post:
 *     tags: [Client Portal]
 *     summary: Enable two-factor authentication (public)
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200: { description: Two-factor enabled }
 *       404:
 *         description: Portal access not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 *
 * /client-portal/{id}/2fa/disable:
 *   post:
 *     tags: [Client Portal]
 *     summary: Disable two-factor authentication (public)
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200: { description: Two-factor disabled }
 *       404:
 *         description: Portal access not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 */
router.post('/', validate(createPortalAccessSchema), clientPortalController.create);
router.post('/login', validate(loginSchema), clientPortalController.login);
router.get('/:id', validateParams(idParamSchema), clientPortalController.getById);
router.put(
  '/:id',
  validateParams(idParamSchema),
  validate(updatePortalAccessSchema),
  clientPortalController.update
);
router.delete('/:id', validateParams(idParamSchema), clientPortalController.delete);
router.put(
  '/:id/password',
  validateParams(idParamSchema),
  validate(updatePasswordSchema),
  clientPortalController.updatePassword
);
router.post(
  '/:id/2fa/enable',
  validateParams(idParamSchema),
  clientPortalController.enableTwoFactor
);
router.post(
  '/:id/2fa/disable',
  validateParams(idParamSchema),
  clientPortalController.disableTwoFactor
);

export default router;
