import express, { Application } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import morgan from 'morgan';
import 'express-async-errors';
import env from './config/env';
import { logger } from './config/logger';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { correlationIdMiddleware } from './middleware/correlationId';
import { apiRateLimiter } from './middleware/rateLimiter';
import { timeoutMiddleware } from './middleware/timeout';
import { metricsMiddleware } from './middleware/metrics';
import { sanitizationMiddleware } from './middleware/sanitization';
import patientRoutes from './routes/patient.routes';
import clientRoutes from './routes/client.routes';
import appointmentRoutes from './routes/appointment.routes';
import medicalRecordRoutes from './routes/medicalRecord.routes';
import prescriptionRoutes from './routes/prescription.routes';
import inventoryRoutes from './routes/inventory.routes';
import invoiceRoutes from './routes/invoice.routes';
import labTestRoutes from './routes/labTest.routes';
import staffRoutes from './routes/staff.routes';
import communicationRoutes from './routes/communication.routes';
import documentRoutes from './routes/document.routes';
import analyticsRoutes from './routes/analytics.routes';

// New module routes
import breedInfoRoutes from './routes/breedInfo.routes';
import patientRelationshipRoutes from './routes/patientRelationship.routes';
import patientReminderRoutes from './routes/patientReminder.routes';
import clientPortalRoutes from './routes/clientPortal.routes';
import loyaltyProgramRoutes from './routes/loyaltyProgram.routes';
import feedbackRoutes from './routes/feedback.routes';
import waitlistRoutes from './routes/waitlist.routes';
import timeBlockRoutes from './routes/timeBlock.routes';
import estimateRoutes from './routes/estimate.routes';
import paymentPlanRoutes from './routes/paymentPlan.routes';
import purchaseOrderRoutes from './routes/purchaseOrder.routes';
import equipmentRoutes from './routes/equipment.routes';
import insuranceClaimRoutes from './routes/insuranceClaim.routes';
import refundRoutes from './routes/refund.routes';
import marketingCampaignRoutes from './routes/marketingCampaign.routes';
import policyRoutes from './routes/policy.routes';
import reportTemplateRoutes from './routes/reportTemplate.routes';
import documentTemplateRoutes from './routes/documentTemplate.routes';
import healthRoutes from './routes/health.routes';
import metricsRoutes from './routes/metrics.routes';

export function createApp(): Application {
  const app = express();

  // Trust proxy - important for rate limiting and getting correct client IP
  app.set('trust proxy', 1);

  // Correlation ID middleware - must be first to track all requests
  app.use(correlationIdMiddleware);

  // Metrics collection middleware
  app.use(metricsMiddleware);

  // Request timeout middleware
  app.use(timeoutMiddleware(30000)); // 30 second timeout

  // Security middleware
  app.use(helmet());
  app.use(
    cors({
      origin: env.corsOrigin,
      credentials: true,
    })
  );

  // Body parsing middleware
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

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

  // Health check and metrics endpoints (before rate limiting)
  app.use('/health', healthRoutes);
  app.use('/metrics', metricsRoutes);

  // Rate limiting middleware (after health checks)
  app.use(apiRateLimiter);

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
  app.use(`${env.apiPrefix}/client-portal`, clientPortalRoutes);
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

  // 404 handler
  app.use(notFoundHandler);

  // Error handler
  app.use(errorHandler);

  return app;
}
