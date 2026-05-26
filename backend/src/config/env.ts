import dotenv from 'dotenv';
import path from 'path';
import Joi from 'joi';
import { DEFAULT_ENV, SECURITY, ERROR_MESSAGES } from '../constants';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

interface EnvConfig {
  // Application
  nodeEnv: string;
  port: number;
  apiPrefix: string;

  // Database
  databaseUrl: string;

  // Redis
  redisUrl: string;

  // JWT
  jwtSecret: string;
  jwtRefreshSecret: string;
  jwtExpiresIn: string; // legacy alias for the access-token TTL
  jwtAccessExpiresIn: string;
  jwtRefreshExpiresIn: string;

  // Field-level encryption
  fieldEncryptionKey: string;

  // CORS
  corsOrigin: string;

  // Rate Limiting
  rateLimitWindowMs: number;
  rateLimitMaxRequests: number;

  // File Upload
  maxFileSize: number;
  uploadDir: string;

  // Feature Flags
  enableSwagger: boolean;
  enableApiDocs: boolean;
}

interface ValidatedEnv {
  NODE_ENV: string;
  PORT: number;
  API_PREFIX: string;
  DATABASE_URL: string;
  REDIS_URL: string;
  JWT_SECRET: string;
  JWT_REFRESH_SECRET: string;
  JWT_ACCESS_EXPIRES_IN: string;
  JWT_REFRESH_EXPIRES_IN: string;
  FIELD_ENCRYPTION_KEY: string;
  CORS_ORIGIN: string;
  RATE_LIMIT_WINDOW_MS: number;
  RATE_LIMIT_MAX_REQUESTS: number;
  MAX_FILE_SIZE: number;
  UPLOAD_DIR: string;
  ENABLE_SWAGGER: boolean;
  ENABLE_API_DOCS: boolean;
}

const isTest = (process.env.NODE_ENV ?? DEFAULT_ENV.NODE_ENV) === 'test';

// In `test` we inject non-production defaults so the suite (which mocks the
// database) does not require real secrets. These are NEVER used outside tests:
// development/staging/production must supply real values or boot fails.
const TEST_DEFAULTS = {
  DATABASE_URL: 'postgresql://test:test@localhost:5432/purple_cross_test?schema=public',
  JWT_SECRET: 'test-jwt-secret-please-change-32-bytes-minimum',
  JWT_REFRESH_SECRET: 'test-refresh-secret-please-change-32-bytes-min',
  FIELD_ENCRYPTION_KEY: 'test-field-encryption-key-please-change-now',
};

const raw = {
  NODE_ENV: process.env.NODE_ENV ?? DEFAULT_ENV.NODE_ENV,
  PORT: process.env.PORT ?? String(DEFAULT_ENV.PORT),
  API_PREFIX: process.env.API_PREFIX ?? DEFAULT_ENV.API_PREFIX,
  DATABASE_URL: process.env.DATABASE_URL ?? (isTest ? TEST_DEFAULTS.DATABASE_URL : undefined),
  REDIS_URL: process.env.REDIS_URL ?? DEFAULT_ENV.REDIS_URL,
  JWT_SECRET: process.env.JWT_SECRET ?? (isTest ? TEST_DEFAULTS.JWT_SECRET : undefined),
  JWT_REFRESH_SECRET:
    process.env.JWT_REFRESH_SECRET ?? (isTest ? TEST_DEFAULTS.JWT_REFRESH_SECRET : undefined),
  JWT_ACCESS_EXPIRES_IN:
    process.env.JWT_ACCESS_EXPIRES_IN ??
    process.env.JWT_EXPIRES_IN ??
    DEFAULT_ENV.JWT_ACCESS_EXPIRES_IN,
  JWT_REFRESH_EXPIRES_IN:
    process.env.JWT_REFRESH_EXPIRES_IN ?? DEFAULT_ENV.JWT_REFRESH_EXPIRES_IN,
  FIELD_ENCRYPTION_KEY:
    process.env.FIELD_ENCRYPTION_KEY ?? (isTest ? TEST_DEFAULTS.FIELD_ENCRYPTION_KEY : undefined),
  CORS_ORIGIN: process.env.CORS_ORIGIN ?? DEFAULT_ENV.CORS_ORIGIN,
  RATE_LIMIT_WINDOW_MS:
    process.env.RATE_LIMIT_WINDOW_MS ?? String(DEFAULT_ENV.RATE_LIMIT_WINDOW_MS),
  RATE_LIMIT_MAX_REQUESTS:
    process.env.RATE_LIMIT_MAX_REQUESTS ?? String(DEFAULT_ENV.RATE_LIMIT_MAX_REQUESTS),
  MAX_FILE_SIZE: process.env.MAX_FILE_SIZE ?? String(DEFAULT_ENV.MAX_FILE_SIZE),
  UPLOAD_DIR: process.env.UPLOAD_DIR ?? DEFAULT_ENV.UPLOAD_DIR,
  ENABLE_SWAGGER: process.env.ENABLE_SWAGGER === 'true',
  ENABLE_API_DOCS: process.env.ENABLE_API_DOCS === 'true',
};

const envSchema = Joi.object<ValidatedEnv, true>({
  NODE_ENV: Joi.string().valid('development', 'test', 'staging', 'production').required(),
  PORT: Joi.number().port().required(),
  API_PREFIX: Joi.string().required(),
  DATABASE_URL: Joi.string()
    .uri({ scheme: ['postgres', 'postgresql'] })
    .required(),
  REDIS_URL: Joi.string().required(),
  JWT_SECRET: Joi.string().min(SECURITY.MIN_SECRET_LENGTH).required(),
  JWT_REFRESH_SECRET: Joi.string()
    .min(SECURITY.MIN_SECRET_LENGTH)
    .invalid(Joi.ref('JWT_SECRET'))
    .required()
    .messages({ 'any.invalid': 'JWT_REFRESH_SECRET must differ from JWT_SECRET' }),
  JWT_ACCESS_EXPIRES_IN: Joi.string().required(),
  JWT_REFRESH_EXPIRES_IN: Joi.string().required(),
  FIELD_ENCRYPTION_KEY: Joi.string().min(16).required(),
  CORS_ORIGIN: Joi.string().required(),
  RATE_LIMIT_WINDOW_MS: Joi.number().positive().required(),
  RATE_LIMIT_MAX_REQUESTS: Joi.number().positive().required(),
  MAX_FILE_SIZE: Joi.number().positive().required(),
  UPLOAD_DIR: Joi.string().required(),
  ENABLE_SWAGGER: Joi.boolean().required(),
  ENABLE_API_DOCS: Joi.boolean().required(),
});

const { value, error } = envSchema.validate(raw, { abortEarly: false, convert: true });

if (error) {
  throw new Error(ERROR_MESSAGES.INVALID_ENV(error.details.map((d) => d.message).join('; ')));
}

const v = value as ValidatedEnv;

const env: EnvConfig = {
  nodeEnv: v.NODE_ENV,
  port: v.PORT,
  apiPrefix: v.API_PREFIX,
  databaseUrl: v.DATABASE_URL,
  redisUrl: v.REDIS_URL,
  jwtSecret: v.JWT_SECRET,
  jwtRefreshSecret: v.JWT_REFRESH_SECRET,
  jwtExpiresIn: v.JWT_ACCESS_EXPIRES_IN,
  jwtAccessExpiresIn: v.JWT_ACCESS_EXPIRES_IN,
  jwtRefreshExpiresIn: v.JWT_REFRESH_EXPIRES_IN,
  fieldEncryptionKey: v.FIELD_ENCRYPTION_KEY,
  corsOrigin: v.CORS_ORIGIN,
  rateLimitWindowMs: v.RATE_LIMIT_WINDOW_MS,
  rateLimitMaxRequests: v.RATE_LIMIT_MAX_REQUESTS,
  maxFileSize: v.MAX_FILE_SIZE,
  uploadDir: v.UPLOAD_DIR,
  enableSwagger: v.ENABLE_SWAGGER,
  enableApiDocs: v.ENABLE_API_DOCS,
};

export default env;
