import { Router } from 'express';
import analyticsController from '../controllers/analytics.controller';

const router = Router();

/**
 * @openapi
 * /analytics/dashboard:
 *   get:
 *     tags: [Analytics]
 *     summary: Get high-level dashboard statistics
 *     responses:
 *       200: { description: Dashboard statistics }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *
 * /analytics/patients:
 *   get:
 *     tags: [Analytics]
 *     summary: Get patient demographic analytics
 *     responses:
 *       200: { description: Patient demographics }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *
 * /analytics/appointments:
 *   get:
 *     tags: [Analytics]
 *     summary: Get appointment analytics
 *     responses:
 *       200: { description: Appointment analytics }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *
 * /analytics/financial:
 *   get:
 *     tags: [Analytics]
 *     summary: Get financial report
 *     responses:
 *       200: { description: Financial report }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *
 * /analytics/inventory:
 *   get:
 *     tags: [Analytics]
 *     summary: Get inventory report
 *     responses:
 *       200: { description: Inventory report }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *
 * /analytics/staff:
 *   get:
 *     tags: [Analytics]
 *     summary: Get staff analytics
 *     responses:
 *       200: { description: Staff analytics }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 */
router.get('/dashboard', analyticsController.getDashboardStats);
router.get('/patients', analyticsController.getPatientDemographics);
router.get('/appointments', analyticsController.getAppointmentAnalytics);
router.get('/financial', analyticsController.getFinancialReport);
router.get('/inventory', analyticsController.getInventoryReport);
router.get('/staff', analyticsController.getStaffAnalytics);

export default router;
