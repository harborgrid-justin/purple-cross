import express, { Application } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import morgan from 'morgan';
import 'express-async-errors';
import env from './config/env';
import { logger } from './config/logger';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
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

export function createApp(): Application {
  const app = express();

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

  // Health check endpoint
  app.get('/health', (_req, res) => {
    res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  });

  // API routes
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

  // 404 handler
  app.use(notFoundHandler);

  // Error handler
  app.use(errorHandler);

  return app;
}
