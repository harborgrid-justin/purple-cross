import request from 'supertest';
import express, { Application } from 'express';

describe('Health Check API (E2E)', () => {
  let app: Application;

  beforeAll(() => {
    app = express();
    
    app.get('/health', (_req, res) => {
      res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'test',
      });
    });
  });

  describe('GET /health', () => {
    it('should return 200 OK', async () => {
      const response = await request(app).get('/health');
      
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('ok');
    });
  });
});
