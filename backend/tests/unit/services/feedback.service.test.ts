import { FeedbackService } from '../../../src/services/feedback.service';
import { prisma } from '../../../src/config/database';

// Mock Prisma
jest.mock('../../../src/config/database', () => ({
  prisma: {
    clientFeedback: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      update: jest.fn(),
    },
  },
}));

describe('FeedbackService', () => {
  let feedbackService: FeedbackService;

  beforeEach(() => {
    feedbackService = new FeedbackService();
    jest.clearAllMocks();
  });

  describe('createFeedback', () => {
    it('should create feedback successfully', async () => {
      const feedbackData = {
        clientId: 'client-123',
        feedbackType: 'service-quality',
        rating: 5,
        comment: 'Great service!',
      };

      const expectedResult = {
        id: 'feedback-123',
        ...feedbackData,
        status: 'new',
        createdAt: new Date(),
      };

      (prisma.clientFeedback.create as jest.Mock).mockResolvedValue(expectedResult);

      const result = await feedbackService.createFeedback(feedbackData);

      expect(prisma.clientFeedback.create).toHaveBeenCalled();
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getFeedback', () => {
    it('should return feedback when found', async () => {
      const feedbackId = 'feedback-123';
      const expectedFeedback = {
        id: feedbackId,
        rating: 5,
        comment: 'Great service!',
      };

      (prisma.clientFeedback.findUnique as jest.Mock).mockResolvedValue(expectedFeedback);

      const result = await feedbackService.getFeedback(feedbackId);

      expect(result).toEqual(expectedFeedback);
    });

    it('should throw error when feedback not found', async () => {
      const feedbackId = 'non-existent';

      (prisma.clientFeedback.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(feedbackService.getFeedback(feedbackId)).rejects.toThrow('Feedback not found');
    });
  });

  describe('listFeedback', () => {
    it('should return paginated feedback', async () => {
      const mockFeedback = [
        { id: 'feedback-1', rating: 5 },
        { id: 'feedback-2', rating: 4 },
      ];

      (prisma.clientFeedback.findMany as jest.Mock).mockResolvedValue(mockFeedback);
      (prisma.clientFeedback.count as jest.Mock).mockResolvedValue(2);

      const result = await feedbackService.listFeedback({});

      expect(result.items).toEqual(mockFeedback);
      expect(result.total).toBe(2);
    });
  });

  describe('updateFeedback', () => {
    it('should update feedback successfully', async () => {
      const feedbackId = 'feedback-123';
      const updateData = { status: 'reviewed' };
      const existingFeedback = { id: feedbackId, status: 'pending' };
      const updatedFeedback = { ...existingFeedback, ...updateData };

      (prisma.clientFeedback.findUnique as jest.Mock).mockResolvedValue(existingFeedback);
      (prisma.clientFeedback.update as jest.Mock).mockResolvedValue(updatedFeedback);

      const result = await feedbackService.updateFeedback(feedbackId, updateData);

      expect(result.status).toBe('reviewed');
    });
  });
});
