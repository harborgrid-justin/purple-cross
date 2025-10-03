import dotenv from 'dotenv';
import path from 'path';

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
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  apiPrefix: process.env.API_PREFIX || '/api/v1',

  databaseUrl: process.env.DATABASE_URL || '',

  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',

  jwtSecret: process.env.JWT_SECRET || 'change-me-in-production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',

  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',

  rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
  rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),

  maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760', 10),
  uploadDir: process.env.UPLOAD_DIR || './uploads',

  enableSwagger: process.env.ENABLE_SWAGGER === 'true',
  enableApiDocs: process.env.ENABLE_API_DOCS === 'true',
};

// Validate required environment variables
const requiredEnvVars = ['DATABASE_URL', 'JWT_SECRET'];
const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);

if (missingEnvVars.length > 0 && env.nodeEnv === 'production') {
  throw new Error(
    `Missing required environment variables: ${missingEnvVars.join(', ')}`
  );
}

export default env;
