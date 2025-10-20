'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const supertest_1 = __importDefault(require('supertest'));
const express_1 = __importDefault(require('express'));
describe('Appointment Workflow (E2E)', () => {
  let app;
  beforeAll(() => {
    app = (0, express_1.default)();
    app.use(express_1.default.json());
    app.post('/api/appointments', (req, res) => {
      const { patientId, clientId, startTime, endTime } = req.body;
      if (!patientId || !clientId || !startTime || !endTime) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
      return res.status(201).json({
        id: 'apt-123',
        patientId,
        clientId,
        startTime,
        endTime,
        status: 'scheduled',
      });
    });
    app.get('/api/appointments/:id', (req, res) => {
      return res.status(200).json({
        id: req.params.id,
        status: 'scheduled',
      });
    });
    app.patch('/api/appointments/:id/complete', (req, res) => {
      return res.status(200).json({
        id: req.params.id,
        status: 'completed',
      });
    });
  });
  it('should complete an appointment workflow', async () => {
    const appointmentData = {
      patientId: 'patient-123',
      clientId: 'client-123',
      startTime: new Date('2024-12-01T10:00:00Z'),
      endTime: new Date('2024-12-01T11:00:00Z'),
    };
    const createResponse = await (0, supertest_1.default)(app)
      .post('/api/appointments')
      .send(appointmentData);
    expect(createResponse.status).toBe(201);
    expect(createResponse.body.status).toBe('scheduled');
    const appointmentId = createResponse.body.id;
    const getResponse = await (0, supertest_1.default)(app).get(
      `/api/appointments/${appointmentId}`
    );
    expect(getResponse.status).toBe(200);
    expect(getResponse.body.id).toBe(appointmentId);
    const completeResponse = await (0, supertest_1.default)(app).patch(
      `/api/appointments/${appointmentId}/complete`
    );
    expect(completeResponse.status).toBe(200);
    expect(completeResponse.body.status).toBe('completed');
  });
  it('should validate appointment data', async () => {
    const invalidData = {
      patientId: 'patient-123',
    };
    const response = await (0, supertest_1.default)(app)
      .post('/api/appointments')
      .send(invalidData);
    expect(response.status).toBe(400);
    expect(response.body.error).toBeDefined();
  });
});
//# sourceMappingURL=appointment-workflow.e2e.js.map
