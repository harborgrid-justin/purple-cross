import { Router } from 'express';
import analyticsController from '../controllers/analytics.controller';

const router = Router();

router.get('/dashboard', analyticsController.getDashboardStats);
router.get('/patients', analyticsController.getPatientDemographics);
router.get('/appointments', analyticsController.getAppointmentAnalytics);
router.get('/financial', analyticsController.getFinancialReport);
router.get('/inventory', analyticsController.getInventoryReport);
router.get('/staff', analyticsController.getStaffAnalytics);

export default router;
