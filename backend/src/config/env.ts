import dotenv from 'dotenv';
import path from 'path';
import { DEFAULT_ENV, REQUIRED_ENV_VARS, ERROR_MESSAGES } from '../constants';

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
  jwtExpiresIn: string;

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

const env: EnvConfig = {
  nodeEnv: process.env.NODE_ENV || DEFAULT_ENV.NODE_ENV,
  port: parseInt(process.env.PORT || String(DEFAULT_ENV.PORT), 10),
  apiPrefix: process.env.API_PREFIX || DEFAULT_ENV.API_PREFIX,

  databaseUrl: process.env.DATABASE_URL || '',

  redisUrl: process.env.REDIS_URL || DEFAULT_ENV.REDIS_URL,

  jwtSecret: process.env.JWT_SECRET || DEFAULT_ENV.JWT_SECRET_FALLBACK,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || DEFAULT_ENV.JWT_EXPIRES_IN,

  corsOrigin: process.env.CORS_ORIGIN || DEFAULT_ENV.CORS_ORIGIN,

  rateLimitWindowMs: parseInt(
    process.env.RATE_LIMIT_WINDOW_MS || String(DEFAULT_ENV.RATE_LIMIT_WINDOW_MS),
    10
  ),
  rateLimitMaxRequests: parseInt(
    process.env.RATE_LIMIT_MAX_REQUESTS || String(DEFAULT_ENV.RATE_LIMIT_MAX_REQUESTS),
    10
  ),

  maxFileSize: parseInt(process.env.MAX_FILE_SIZE || String(DEFAULT_ENV.MAX_FILE_SIZE), 10),
  uploadDir: process.env.UPLOAD_DIR || DEFAULT_ENV.UPLOAD_DIR,

  enableSwagger: process.env.ENABLE_SWAGGER === 'true',
  enableApiDocs: process.env.ENABLE_API_DOCS === 'true',
};

// Validate required environment variables
const missingEnvVars = REQUIRED_ENV_VARS.filter((envVar) => !process.env[envVar]);

if (missingEnvVars.length > 0 && env.nodeEnv === 'production') {
  throw new Error(ERROR_MESSAGES.MISSING_ENV_VARS([...missingEnvVars]));
}

export default env;
