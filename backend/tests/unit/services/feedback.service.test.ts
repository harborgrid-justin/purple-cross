import { FeedbackService } from '../../../src/services/feedback.service';
import { prisma } from '../../../src/config/database';

// Mock Prisma
jest.mock('../../../src/config/database', () => ({
  prisma: {
    feedback: {
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
        rating: 5,
        comment: 'Great service!',
        category: 'service-quality',
      };

      const expectedResult = {
        id: 'feedback-123',
        ...feedbackData,
        status: 'pending',
        createdAt: new Date(),
      };

      (prisma.feedback.create as jest.Mock).mockResolvedValue(expectedResult);

      const result = await feedbackService.createFeedback(feedbackData);

      expect(prisma.feedback.create).toHaveBeenCalled();
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

      (prisma.feedback.findUnique as jest.Mock).mockResolvedValue(expectedFeedback);

      const result = await feedbackService.getFeedback(feedbackId);

      expect(result).toEqual(expectedFeedback);
    });

    it('should throw error when feedback not found', async () => {
      const feedbackId = 'non-existent';

      (prisma.feedback.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(feedbackService.getFeedback(feedbackId)).rejects.toThrow('Feedback not found');
    });
  });

  describe('listFeedback', () => {
    it('should return paginated feedback', async () => {
      const mockFeedback = [
        { id: 'feedback-1', rating: 5 },
        { id: 'feedback-2', rating: 4 },
      ];

      (prisma.feedback.findMany as jest.Mock).mockResolvedValue(mockFeedback);
      (prisma.feedback.count as jest.Mock).mockResolvedValue(2);

      const result = await feedbackService.listFeedback({});

      expect(result.data).toEqual(mockFeedback);
      expect(result.pagination.total).toBe(2);
    });
  });

  describe('updateFeedback', () => {
    it('should update feedback successfully', async () => {
      const feedbackId = 'feedback-123';
      const updateData = { status: 'reviewed' };
      const existingFeedback = { id: feedbackId, status: 'pending' };
      const updatedFeedback = { ...existingFeedback, ...updateData };

      (prisma.feedback.findUnique as jest.Mock).mockResolvedValue(existingFeedback);
      (prisma.feedback.update as jest.Mock).mockResolvedValue(updatedFeedback);

      const result = await feedbackService.updateFeedback(feedbackId, updateData);

      expect(result.status).toBe('reviewed');
    });
  });
});
