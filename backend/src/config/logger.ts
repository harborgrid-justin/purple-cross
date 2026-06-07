import winston from 'winston';
import path from 'path';
import { redactDeep } from '../utils/pii-redact';

const logLevel = process.env.LOG_LEVEL || 'info';
const logDir = process.env.LOG_FILE_PATH || './logs';

// Redact PII/PHI/credentials from log metadata. Mutates the info object's
// string-keyed fields in place so Winston's internal symbol props are preserved.
const PRESERVED_KEYS = new Set([
  'level',
  'message',
  'timestamp',
  'stack',
  'environment',
  'version',
]);
const redactionFormat = winston.format((info) => {
  for (const key of Object.keys(info)) {
    if (!PRESERVED_KEYS.has(key)) {
      info[key] = redactDeep(info[key]);
    }
  }
  return info;
})();

/**
 * Custom format for structured logging
 * Includes correlation IDs for distributed tracing
 */
const structuredFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  redactionFormat,
  winston.format.json(),
  winston.format((info) => {
    // Add environment and version to all logs
    info.environment = process.env.NODE_ENV || 'development';
    info.version = process.env.npm_package_version || '1.0.0';
    return info;
  })()
);

const logger = winston.createLogger({
  level: logLevel,
  format: structuredFormat,
  defaultMeta: {
    service: 'purple-cross-api',
    pid: process.pid,
  },
  transports: [
    // Write all logs with importance level of `error` or less to `error.log`
    new winston.transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error',
      maxsize: 10485760, // 10MB
      maxFiles: 5,
    }),
    // Write all logs with importance level of `info` or less to `combined.log`
    new winston.transports.File({
      filename: path.join(logDir, 'combined.log'),
      maxsize: 10485760, // 10MB
      maxFiles: 5,
    }),
  ],
  // Handle exceptions and rejections
  exceptionHandlers: [
    new winston.transports.File({
      filename: path.join(logDir, 'exceptions.log'),
      maxsize: 10485760,
      maxFiles: 5,
    }),
  ],
  rejectionHandlers: [
    new winston.transports.File({
      filename: path.join(logDir, 'rejections.log'),
      maxsize: 10485760,
      maxFiles: 5,
    }),
  ],
});

// If we're not in production, log to the console with a simple format
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
    })
  );
} else {
  // In production also emit structured JSON to stdout so a container log
  // collector (Fluent Bit / Vector / Loki agent) can scrape it off-box.
  logger.add(new winston.transports.Console());
}

// Optional off-box log shipping. When `LOG_SHIPPING_ENABLED=true` the same
// redacted, structured records are POSTed to an HTTP log sink (e.g. Logstash
// HTTP input, Vector, or a Loki/Datadog HTTP endpoint). Credentials/host are
// read from the environment so no secrets live in code. Failures here never
// affect request handling — winston swallows transport errors.
if (process.env.LOG_SHIPPING_ENABLED === 'true' && process.env.LOG_SHIPPING_HOST) {
  const headers: Record<string, string> = {};
  if (process.env.LOG_SHIPPING_API_KEY) {
    headers.Authorization = `Bearer ${process.env.LOG_SHIPPING_API_KEY}`;
  }
  logger.add(
    new winston.transports.Http({
      host: process.env.LOG_SHIPPING_HOST,
      port: process.env.LOG_SHIPPING_PORT ? Number(process.env.LOG_SHIPPING_PORT) : 443,
      path: process.env.LOG_SHIPPING_PATH || '/',
      ssl: process.env.LOG_SHIPPING_SSL !== 'false',
      headers,
    })
  );
}

export { logger };
export default logger;
