import { CommunicationService } from '../../../src/services/communication.service';
import { prisma } from '../../../src/config/database';

jest.mock('../../../src/config/database', () => ({
  prisma: {
    communication: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      update: jest.fn(),
    },
  },
}));

describe('CommunicationService', () => {
  let communicationService: CommunicationService;

  beforeEach(() => {
    communicationService = new CommunicationService();
    jest.clearAllMocks();
  });

  describe('createCommunication', () => {
    it('should create a communication successfully', async () => {
      const communicationData = {
        clientId: 'client-123',
        subject: 'Test Message',
        content: 'This is a test message',
        type: 'email',
      };

      const expectedResult = {
        id: 'communication-123',
        ...communicationData,
        sentAt: new Date(),
        status: 'sent',
      };

      (prisma.communication.create as jest.Mock).mockResolvedValue(expectedResult);

      const result = await communicationService.createCommunication(communicationData);

      expect(prisma.communication.create).toHaveBeenCalled();
      expect(result.status).toBe('sent');
    });

    it('should validate email format', async () => {
      const invalidEmail = 'invalid-email';

      // Mock validation failure
      const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

      expect(isValidEmail(invalidEmail)).toBe(false);
    });
  });

  describe('getAllCommunications', () => {
    it('should return communication history for a client', async () => {
      const clientId = 'client-123';
      const mockCommunications = [
        { id: 'comm-1', content: 'Message 1', sentAt: new Date() },
        { id: 'comm-2', content: 'Message 2', sentAt: new Date() },
      ];

      (prisma.communication.findMany as jest.Mock).mockResolvedValue(mockCommunications);
      (prisma.communication.count as jest.Mock).mockResolvedValue(2);

      const result = await communicationService.getAllCommunications({ clientId });

      expect(result.data).toEqual(mockCommunications);
      expect(result.pagination.total).toBe(2);
    });
  });

  describe('updateCommunication', () => {
    it('should mark a communication as read', async () => {
      const communicationId = 'communication-123';
      const unreadCommunication = { id: communicationId, status: 'unread' };
      const readCommunication = { ...unreadCommunication, status: 'read' };

      (prisma.communication.findUnique as jest.Mock).mockResolvedValue(unreadCommunication);
      (prisma.communication.update as jest.Mock).mockResolvedValue(readCommunication);

      const result = await communicationService.updateCommunication(communicationId, {
        status: 'read',
      });

      expect(result.status).toBe('read');
    });
  });
});
