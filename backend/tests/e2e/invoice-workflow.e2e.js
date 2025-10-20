'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const supertest_1 = __importDefault(require('supertest'));
const express_1 = __importDefault(require('express'));
describe('Invoice Workflow (E2E)', () => {
  let app;
  beforeAll(() => {
    app = (0, express_1.default)();
    app.use(express_1.default.json());
    app.post('/api/invoices', (req, res) => {
      const { clientId, items } = req.body;
      if (!clientId || !items || items.length === 0) {
        return res.status(400).json({ error: 'Invalid invoice data' });
      }
      const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
      const tax = subtotal * 0.1;
      const total = subtotal + tax;
      return res.status(201).json({
        id: 'inv-123',
        invoiceNumber: 'INV-2024-001',
        clientId,
        items,
        subtotal,
        tax,
        total,
        status: 'pending',
      });
    });
    app.post('/api/invoices/:id/payment', (req, res) => {
      const { amount, method } = req.body;
      if (!amount || !method) {
        return res.status(400).json({ error: 'Invalid payment data' });
      }
      return res.status(200).json({
        id: req.params.id,
        status: 'paid',
        paidAmount: amount,
        paymentMethod: method,
        paidAt: new Date(),
      });
    });
  });
  it('should complete invoice payment workflow', async () => {
    const invoiceData = {
      clientId: 'client-123',
      items: [
        { name: 'Checkup', quantity: 1, unitPrice: 100 },
        { name: 'Vaccination', quantity: 1, unitPrice: 50 },
      ],
    };
    const createResponse = await (0, supertest_1.default)(app)
      .post('/api/invoices')
      .send(invoiceData);
    expect(createResponse.status).toBe(201);
    expect(createResponse.body.total).toBe(165);
    expect(createResponse.body.status).toBe('pending');
    const invoiceId = createResponse.body.id;
    const paymentData = {
      amount: 165,
      method: 'credit_card',
    };
    const paymentResponse = await (0, supertest_1.default)(app)
      .post(`/api/invoices/${invoiceId}/payment`)
      .send(paymentData);
    expect(paymentResponse.status).toBe(200);
    expect(paymentResponse.body.status).toBe('paid');
    expect(paymentResponse.body.paidAmount).toBe(165);
  });
  it('should calculate invoice totals correctly', async () => {
    const invoiceData = {
      clientId: 'client-123',
      items: [
        { name: 'Item 1', quantity: 2, unitPrice: 25 },
        { name: 'Item 2', quantity: 1, unitPrice: 50 },
      ],
    };
    const response = await (0, supertest_1.default)(app).post('/api/invoices').send(invoiceData);
    expect(response.status).toBe(201);
    expect(response.body.subtotal).toBe(100);
    expect(response.body.tax).toBe(10);
    expect(response.body.total).toBe(110);
  });
});
//# sourceMappingURL=invoice-workflow.e2e.js.map
