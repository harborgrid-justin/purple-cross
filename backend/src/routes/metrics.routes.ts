import { Router, Request, Response } from 'express';
import { register } from '../config/metrics';

const router = Router();

/**
 * Prometheus metrics endpoint (text exposition format). Mounted behind
 * authenticate + authorize(ADMIN) in app.ts. Scrapers use an ADMIN/service JWT.
 */
router.get('/', async (_req: Request, res: Response) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

export default router;
