'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const supertest_1 = __importDefault(require('supertest'));
const express_1 = __importDefault(require('express'));
describe('Health Check API (E2E)', () => {
  let app;
  beforeAll(() => {
    app = (0, express_1.default)();
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
      const response = await (0, supertest_1.default)(app).get('/health');
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('ok');
    });
  });
});
//# sourceMappingURL=health.e2e.js.map
