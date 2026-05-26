import { Router } from 'express';
import Joi from 'joi';
import authController from '../controllers/auth.controller';
import { validate } from '../middleware/validation';
import { authenticate, authorize } from '../middleware/auth';
import { authRateLimiter } from '../middleware/rate-limiter';
import { ALL_ROLES, ROLES } from '../constants';

const router = Router();

const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(128).required(),
  firstName: Joi.string().optional(),
  lastName: Joi.string().optional(),
});

const createUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(128).required(),
  role: Joi.string()
    .valid(...ALL_ROLES)
    .required(),
  firstName: Joi.string().optional(),
  lastName: Joi.string().optional(),
  staffId: Joi.string().uuid().optional(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const refreshSchema = Joi.object({
  refreshToken: Joi.string().required(),
});

/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Authenticate and receive access + refresh tokens
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
 *       200:
 *         description: Authenticated
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/AuthTokens' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *
 * /auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Bootstrap the first (ADMIN) account; closed once a user exists
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
 *               password: { type: string, minLength: 8 }
 *               firstName: { type: string }
 *               lastName: { type: string }
 *     responses:
 *       201: { description: User created }
 *       403: { description: Registration closed }
 *
 * /auth/refresh:
 *   post:
 *     tags: [Auth]
 *     summary: Exchange a refresh token for a new token pair (rotating)
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [refreshToken]
 *             properties:
 *               refreshToken: { type: string }
 *     responses:
 *       200:
 *         description: Rotated
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/AuthTokens' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *
 * /auth/me:
 *   get:
 *     tags: [Auth]
 *     summary: Return the authenticated principal
 *     responses:
 *       200: { description: Current user }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 */

// Public endpoints
router.post('/register', validate(registerSchema), authController.register);
router.post('/login', authRateLimiter, validate(loginSchema), authController.login);
router.post('/refresh', authRateLimiter, validate(refreshSchema), authController.refresh);
router.post('/logout', validate(refreshSchema), authController.logout);

// Authenticated endpoints
router.get('/me', authenticate, authController.me);

// Admin-only: provision new staff logins
router.post(
  '/users',
  authenticate,
  authorize(ROLES.ADMIN),
  validate(createUserSchema),
  authController.createUser
);

export default router;
