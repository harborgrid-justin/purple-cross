import { Job } from 'bullmq';
import { processEmailJob, queueEmail, EmailJobData } from '../../../src/jobs/email.job';
import { emailQueue } from '../../../src/config/queue';

// Mock the logger
jest.mock('../../../src/config/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
  },
}));

// Mock the email queue
jest.mock('../../../src/config/queue', () => ({
  emailQueue: {
    add: jest.fn(),
  },
}));

describe('Email Job', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('processEmailJob', () => {
    it('should process email job successfully', async () => {
      const jobData: EmailJobData = {
        to: 'test@example.com',
        subject: 'Test Subject',
        template: 'test-template',
        context: { name: 'Test User' },
      };

      const mockJob = {
        id: 'test-job-id',
        data: jobData,
        updateProgress: jest.fn().mockResolvedValue(undefined),
      } as unknown as Job<EmailJobData>;

      await processEmailJob(mockJob);

      expect(mockJob.updateProgress).toHaveBeenCalledWith(10);
      expect(mockJob.updateProgress).toHaveBeenCalledWith(100);
    });

    it('should handle multiple recipients', async () => {
      const jobData: EmailJobData = {
        to: ['test1@example.com', 'test2@example.com'],
        subject: 'Test Subject',
        template: 'test-template',
        context: {},
      };

      const mockJob = {
        id: 'test-job-id',
        data: jobData,
        updateProgress: jest.fn().mockResolvedValue(undefined),
      } as unknown as Job<EmailJobData>;

      await processEmailJob(mockJob);

      expect(mockJob.updateProgress).toHaveBeenCalled();
    });

    it('should throw error on failure', async () => {
      const jobData: EmailJobData = {
        to: 'test@example.com',
        subject: 'Test Subject',
        template: 'test-template',
        context: {},
      };

      const mockJob = {
        id: 'test-job-id',
        data: jobData,
        updateProgress: jest.fn().mockRejectedValue(new Error('Update failed')),
      } as unknown as Job<EmailJobData>;

      await expect(processEmailJob(mockJob)).rejects.toThrow('Update failed');
    });
  });

  describe('queueEmail', () => {
    it('should queue email job successfully', async () => {
      const emailData: EmailJobData = {
        to: 'test@example.com',
        subject: 'Test Subject',
        template: 'test-template',
        context: {},
        priority: 3,
      };

      const mockJobId = 'queued-job-id';
      (emailQueue.add as jest.Mock).mockResolvedValue({ id: mockJobId });

      const jobId = await queueEmail(emailData);

      expect(jobId).toBe(mockJobId);
      expect(emailQueue.add).toHaveBeenCalledWith('send-email', emailData, {
        priority: 3,
      });
    });

    it('should use default priority if not provided', async () => {
      const emailData: EmailJobData = {
        to: 'test@example.com',
        subject: 'Test Subject',
        template: 'test-template',
        context: {},
      };

      (emailQueue.add as jest.Mock).mockResolvedValue({ id: 'job-id' });

      await queueEmail(emailData);

      expect(emailQueue.add).toHaveBeenCalledWith('send-email', emailData, {
        priority: 5,
      });
    });
  });
});
