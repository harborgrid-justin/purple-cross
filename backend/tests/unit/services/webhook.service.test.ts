import { WebhookService } from '../../../src/services/webhook.service';
import { prisma } from '../../../src/config/database';
import { AppError } from '../../../src/middleware/error-handler';

// Mock Prisma
jest.mock('../../../src/config/database', () => ({
  prisma: {
    webhookSubscription: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

describe('WebhookService', () => {
  let webhookService: WebhookService;

  beforeEach(() => {
    webhookService = new WebhookService();
    jest.clearAllMocks();
  });

  describe('createWebhook', () => {
    it('should create a webhook successfully', async () => {
      const webhookData = {
        name: 'Test Webhook',
        url: 'https://example.com/webhook',
        events: ['patient.created', 'appointment.created'],
        active: true,
      };

      const expectedResult = {
        id: 'webhook-123',
        ...webhookData,
        secret: expect.any(String),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (prisma.webhookSubscription.create as jest.Mock).mockResolvedValue(expectedResult);

      const result = await webhookService.createWebhook(webhookData);

      expect(prisma.webhookSubscription.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          name: webhookData.name,
          url: webhookData.url,
          events: webhookData.events,
          active: webhookData.active,
          secret: expect.any(String),
        }),
      });
      expect(result).toEqual(expectedResult);
    });

    it('should throw error for invalid URL', async () => {
      const webhookData = {
        name: 'Test Webhook',
        url: 'invalid-url',
        events: ['patient.created'],
      };

      await expect(webhookService.createWebhook(webhookData)).rejects.toThrow(AppError);
      expect(prisma.webhookSubscription.create).not.toHaveBeenCalled();
    });

    it('should throw error for empty events array', async () => {
      const webhookData = {
        name: 'Test Webhook',
        url: 'https://example.com/webhook',
        events: [],
      };

      await expect(webhookService.createWebhook(webhookData)).rejects.toThrow(AppError);
      expect(prisma.webhookSubscription.create).not.toHaveBeenCalled();
    });
  });

  describe('getWebhookById', () => {
    it('should return a webhook when found', async () => {
      const webhookId = 'webhook-123';
      const expectedWebhook = {
        id: webhookId,
        name: 'Test Webhook',
        url: 'https://example.com/webhook',
        events: ['patient.created'],
        secret: 'secret-key',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (prisma.webhookSubscription.findUnique as jest.Mock).mockResolvedValue(expectedWebhook);

      const result = await webhookService.getWebhookById(webhookId);

      expect(prisma.webhookSubscription.findUnique).toHaveBeenCalledWith({
        where: { id: webhookId },
      });
      expect(result).toEqual(expectedWebhook);
    });

    it('should throw error when webhook not found', async () => {
      const webhookId = 'non-existent';

      (prisma.webhookSubscription.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(webhookService.getWebhookById(webhookId)).rejects.toThrow(AppError);
    });
  });

  describe('getWebhooks', () => {
    it('should return paginated webhooks', async () => {
      const webhooks = [
        {
          id: 'webhook-1',
          name: 'Webhook 1',
          url: 'https://example.com/webhook1',
          events: ['patient.created'],
          secret: 'secret-1',
          active: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'webhook-2',
          name: 'Webhook 2',
          url: 'https://example.com/webhook2',
          events: ['appointment.created'],
          secret: 'secret-2',
          active: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      (prisma.webhookSubscription.findMany as jest.Mock).mockResolvedValue(webhooks);
      (prisma.webhookSubscription.count as jest.Mock).mockResolvedValue(2);

      const result = await webhookService.getWebhooks({ page: 1, limit: 10 });

      expect(result.webhooks).toEqual(webhooks);
      expect(result.pagination).toEqual({
        page: 1,
        limit: 10,
        total: 2,
        totalPages: 1,
      });
    });

    it('should filter by active status', async () => {
      (prisma.webhookSubscription.findMany as jest.Mock).mockResolvedValue([]);
      (prisma.webhookSubscription.count as jest.Mock).mockResolvedValue(0);

      await webhookService.getWebhooks({ active: true });

      expect(prisma.webhookSubscription.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { active: true },
        })
      );
    });
  });

  describe('updateWebhook', () => {
    it('should update a webhook successfully', async () => {
      const webhookId = 'webhook-123';
      const updateData = {
        name: 'Updated Webhook',
        active: false,
      };

      const existingWebhook = {
        id: webhookId,
        name: 'Old Name',
        url: 'https://example.com/webhook',
        events: ['patient.created'],
        secret: 'secret-key',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updatedWebhook = {
        ...existingWebhook,
        ...updateData,
      };

      (prisma.webhookSubscription.findUnique as jest.Mock).mockResolvedValue(existingWebhook);
      (prisma.webhookSubscription.update as jest.Mock).mockResolvedValue(updatedWebhook);

      const result = await webhookService.updateWebhook(webhookId, updateData);

      expect(prisma.webhookSubscription.update).toHaveBeenCalledWith({
        where: { id: webhookId },
        data: updateData,
      });
      expect(result).toEqual(updatedWebhook);
    });
  });

  describe('deleteWebhook', () => {
    it('should delete a webhook successfully', async () => {
      const webhookId = 'webhook-123';
      const existingWebhook = {
        id: webhookId,
        name: 'Test Webhook',
        url: 'https://example.com/webhook',
        events: ['patient.created'],
        secret: 'secret-key',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (prisma.webhookSubscription.findUnique as jest.Mock).mockResolvedValue(existingWebhook);
      (prisma.webhookSubscription.delete as jest.Mock).mockResolvedValue(existingWebhook);

      await webhookService.deleteWebhook(webhookId);

      expect(prisma.webhookSubscription.delete).toHaveBeenCalledWith({
        where: { id: webhookId },
      });
    });
  });

  describe('regenerateSecret', () => {
    it('should regenerate webhook secret', async () => {
      const webhookId = 'webhook-123';
      const existingWebhook = {
        id: webhookId,
        name: 'Test Webhook',
        url: 'https://example.com/webhook',
        events: ['patient.created'],
        secret: 'old-secret',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updatedWebhook = {
        ...existingWebhook,
        secret: 'new-secret',
      };

      (prisma.webhookSubscription.findUnique as jest.Mock).mockResolvedValue(existingWebhook);
      (prisma.webhookSubscription.update as jest.Mock).mockResolvedValue(updatedWebhook);

      const result = await webhookService.regenerateSecret(webhookId);

      expect(prisma.webhookSubscription.update).toHaveBeenCalledWith({
        where: { id: webhookId },
        data: { secret: expect.any(String) },
      });
      expect(result.secret).not.toBe(existingWebhook.secret);
    });
  });

  describe('getWebhooksByEvent', () => {
    it('should return webhooks subscribed to event', async () => {
      const event = 'patient.created';
      const webhooks = [
        {
          id: 'webhook-1',
          name: 'Webhook 1',
          url: 'https://example.com/webhook1',
          events: [event, 'appointment.created'],
          secret: 'secret-1',
          active: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      (prisma.webhookSubscription.findMany as jest.Mock).mockResolvedValue(webhooks);

      const result = await webhookService.getWebhooksByEvent(event);

      expect(prisma.webhookSubscription.findMany).toHaveBeenCalledWith({
        where: {
          active: true,
          events: {
            has: event,
          },
        },
      });
      expect(result).toEqual(webhooks);
    });
  });

  describe('signature methods', () => {
    it('should generate signature', () => {
      const payload = '{"test": "data"}';
      const secret = 'test-secret';

      const signature = webhookService.generateSignature(payload, secret);

      expect(signature).toBeDefined();
      expect(typeof signature).toBe('string');
      expect(signature.length).toBe(64); // SHA256 hex is 64 chars
    });

    it('should verify valid signature', () => {
      const payload = '{"test": "data"}';
      const secret = 'test-secret';

      const signature = webhookService.generateSignature(payload, secret);
      const isValid = webhookService.verifySignature(payload, signature, secret);

      expect(isValid).toBe(true);
    });

    it('should reject invalid signature', () => {
      const payload = '{"test": "data"}';
      const secret = 'test-secret';
      const wrongSignature = 'invalid-signature-1234567890123456789012345678901234567890123456789012';

      const isValid = webhookService.verifySignature(payload, wrongSignature, secret);

      expect(isValid).toBe(false);
    });
  });
});
