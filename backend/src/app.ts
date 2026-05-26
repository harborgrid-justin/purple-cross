import express, { Application } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import morgan from 'morgan';
import 'express-async-errors';
import { initializeSentry, Sentry } from './config/sentry';
import env from './config/env';
import { logger } from './config/logger';
import { errorHandler, notFoundHandler } from './middleware/error-handler';
import { correlationIdMiddleware } from './middleware/correlation-id';
import { apiRateLimiter } from './middleware/rate-limiter';
import { timeoutMiddleware } from './middleware/timeout';
import { metricsMiddleware } from './middleware/metrics';
import { sanitizationMiddleware } from './middleware/sanitization';
import { requestContextMiddleware } from './middleware/request-context';
import { authenticate, authorize } from './middleware/auth';
import { FILE_UPLOAD, ROLES } from './constants';
import authRoutes from './routes/auth.routes';
import patientRoutes from './routes/patient.routes';
import clientRoutes from './routes/client.routes';
import appointmentRoutes from './routes/appointment.routes';
import medicalRecordRoutes from './routes/medical-record.routes';
import prescriptionRoutes from './routes/prescription.routes';
import inventoryRoutes from './routes/inventory.routes';
import invoiceRoutes from './routes/invoice.routes';
import labTestRoutes from './routes/lab-test.routes';
import staffRoutes from './routes/staff.routes';
import communicationRoutes from './routes/communication.routes';
import documentRoutes from './routes/document.routes';
import analyticsRoutes from './routes/analytics.routes';

// New module routes
import breedInfoRoutes from './routes/breed-info.routes';
import patientRelationshipRoutes from './routes/patient-relationship.routes';
import patientReminderRoutes from './routes/patient-reminder.routes';
import clientPortalRoutes from './routes/client-portal.routes';
import loyaltyProgramRoutes from './routes/loyalty-program.routes';
import feedbackRoutes from './routes/feedback.routes';
import waitlistRoutes from './routes/waitlist.routes';
import timeBlockRoutes from './routes/time-block.routes';
import estimateRoutes from './routes/estimate.routes';
import paymentPlanRoutes from './routes/payment-plan.routes';
import purchaseOrderRoutes from './routes/purchase-order.routes';
import equipmentRoutes from './routes/equipment.routes';
import insuranceClaimRoutes from './routes/insurance-claim.routes';
import refundRoutes from './routes/refund.routes';
import marketingCampaignRoutes from './routes/marketing-campaign.routes';
import policyRoutes from './routes/policy.routes';
import reportTemplateRoutes from './routes/report-template.routes';
import documentTemplateRoutes from './routes/document-template.routes';
import webhookRoutes from './routes/webhook.routes';
import workflowRoutes from './routes/workflow.routes';
import workflowTemplateRoutes from './routes/workflow-template.routes';
import workflowExecutionRoutes from './routes/workflow-execution.routes';
import healthRoutes from './routes/health.routes';
import metricsRoutes from './routes/metrics.routes';
import { serverAdapter } from './config/bull-board';

export function createApp(): Application {
  // Initialize Sentry FIRST - before creating app
  initializeSentry();

  const app = express();

  // Trust proxy - important for rate limiting and getting correct client IP
  app.set('trust proxy', 1);

  // Sentry request and tracing handled by expressIntegration in init

  // Correlation ID middleware - track all requests
  app.use(correlationIdMiddleware);

  // Open the AsyncLocalStorage request context (correlation id / ip / UA);
  // enriched with the authenticated principal by the auth middleware.
  app.use(requestContextMiddleware);

  // Metrics collection middleware
  app.use(metricsMiddleware);

  // Request timeout middleware
  app.use(timeoutMiddleware()); // Uses default timeout from constants

  // Security middleware
  app.use(helmet());
  app.use(
    cors({
      origin: env.corsOrigin,
      credentials: true,
    })
  );

  // Body parsing middleware
  app.use(express.json({ limit: FILE_UPLOAD.BODY_LIMIT }));
  app.use(express.urlencoded({ extended: true, limit: FILE_UPLOAD.BODY_LIMIT }));

  // Input sanitization middleware
  app.use(sanitizationMiddleware);

  // Compression middleware
  app.use(compression());

  // Logging middleware
  if (env.nodeEnv === 'development') {
    app.use(morgan('dev'));
  } else {
    app.use(
      morgan('combined', {
        stream: { write: (message) => logger.info(message.trim()) },
      })
    );
  }

  // Health checks remain public for load balancers / Kubernetes probes.
  app.use('/health', healthRoutes);

  // Metrics and the queue dashboard expose internal detail: require an
  // authenticated ADMIN. (A dedicated scrape token can replace JWT here later.)
  app.use('/metrics', authenticate, authorize(ROLES.ADMIN), metricsRoutes);
  app.use('/admin/queues', authenticate, authorize(ROLES.ADMIN), serverAdapter.getRouter());

  // Rate limiting middleware (after health checks)
  app.use(apiRateLimiter);

  // Public auth endpoints (login / bootstrap register / refresh) — must be
  // mounted before the global guard below.
  app.use(`${env.apiPrefix}/auth`, authRoutes);

  // Client portal authenticates against its own (separate) principal, so it is
  // mounted ahead of the staff guard and manages its own access internally.
  app.use(`${env.apiPrefix}/client-portal`, clientPortalRoutes);

  // Everything mounted below requires a valid staff access token.
  app.use(env.apiPrefix, authenticate);

  // API routes - Core modules
  app.use(`${env.apiPrefix}/patients`, patientRoutes);
  app.use(`${env.apiPrefix}/clients`, clientRoutes);
  app.use(`${env.apiPrefix}/appointments`, appointmentRoutes);
  app.use(`${env.apiPrefix}/medical-records`, medicalRecordRoutes);
  app.use(`${env.apiPrefix}/prescriptions`, prescriptionRoutes);
  app.use(`${env.apiPrefix}/inventory`, inventoryRoutes);
  app.use(`${env.apiPrefix}/invoices`, invoiceRoutes);
  app.use(`${env.apiPrefix}/lab-tests`, labTestRoutes);
  app.use(`${env.apiPrefix}/staff`, staffRoutes);
  app.use(`${env.apiPrefix}/communications`, communicationRoutes);
  app.use(`${env.apiPrefix}/documents`, documentRoutes);
  app.use(`${env.apiPrefix}/analytics`, analyticsRoutes);

  // API routes - Extended modules
  app.use(`${env.apiPrefix}/breed-info`, breedInfoRoutes);
  app.use(`${env.apiPrefix}/patient-relationships`, patientRelationshipRoutes);
  app.use(`${env.apiPrefix}/patient-reminders`, patientReminderRoutes);
  app.use(`${env.apiPrefix}/loyalty-programs`, loyaltyProgramRoutes);
  app.use(`${env.apiPrefix}/feedback`, feedbackRoutes);
  app.use(`${env.apiPrefix}/waitlist`, waitlistRoutes);
  app.use(`${env.apiPrefix}/time-blocks`, timeBlockRoutes);
  app.use(`${env.apiPrefix}/estimates`, estimateRoutes);
  app.use(`${env.apiPrefix}/payment-plans`, paymentPlanRoutes);
  app.use(`${env.apiPrefix}/purchase-orders`, purchaseOrderRoutes);
  app.use(`${env.apiPrefix}/equipment`, equipmentRoutes);
  app.use(`${env.apiPrefix}/insurance-claims`, insuranceClaimRoutes);
  app.use(`${env.apiPrefix}/refunds`, refundRoutes);
  app.use(`${env.apiPrefix}/marketing-campaigns`, marketingCampaignRoutes);
  app.use(`${env.apiPrefix}/policies`, policyRoutes);
  app.use(`${env.apiPrefix}/report-templates`, reportTemplateRoutes);
  app.use(`${env.apiPrefix}/document-templates`, documentTemplateRoutes);
  app.use(`${env.apiPrefix}/webhooks`, webhookRoutes);
  app.use(`${env.apiPrefix}/workflows`, workflowRoutes);
  app.use(`${env.apiPrefix}/workflow-templates`, workflowTemplateRoutes);
  app.use(`${env.apiPrefix}/workflow-executions`, workflowExecutionRoutes);

  // 404 handler
  app.use(notFoundHandler);

  // Sentry error handler - MUST be before other error handlers
  Sentry.setupExpressErrorHandler(app);

  // Error handler
  app.use(errorHandler);

  return app;
}
