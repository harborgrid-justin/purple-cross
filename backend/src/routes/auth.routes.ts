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
