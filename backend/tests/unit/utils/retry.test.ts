import { retry, retryWithJitter } from '../../../src/utils/retry';

describe('retry', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should succeed on first attempt', async () => {
    const mockFn = jest.fn().mockResolvedValue('success');
    
    const result = await retry(mockFn, {
      maxAttempts: 3,
      initialDelay: 100,
      name: 'test',
    });
    
    expect(result).toBe('success');
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('should retry on failure and eventually succeed', async () => {
    const mockFn = jest.fn()
      .mockRejectedValueOnce(new Error('failure 1'))
      .mockRejectedValueOnce(new Error('failure 2'))
      .mockResolvedValue('success');
    
    const result = await retry(mockFn, {
      maxAttempts: 3,
      initialDelay: 100,
      maxDelay: 1000,
      name: 'test',
    });
    
    expect(result).toBe('success');
    expect(mockFn).toHaveBeenCalledTimes(3);
  });

  it('should throw error after max attempts', async () => {
    const mockFn = jest.fn().mockRejectedValue(new Error('persistent failure'));
    
    await expect(
      retry(mockFn, {
        maxAttempts: 3,
        initialDelay: 100,
        name: 'test',
      })
    ).rejects.toThrow('persistent failure');
    
    expect(mockFn).toHaveBeenCalledTimes(3);
  });

  it('should apply exponential backoff', async () => {
    const mockFn = jest.fn()
      .mockRejectedValueOnce(new Error('failure 1'))
      .mockRejectedValueOnce(new Error('failure 2'))
      .mockResolvedValue('success');
    
    const startTime = Date.now();
    
    await retry(mockFn, {
      maxAttempts: 3,
      initialDelay: 100,
      maxDelay: 10000,
      backoffMultiplier: 2,
      name: 'test',
    });
    
    const duration = Date.now() - startTime;
    
    // Should wait at least initialDelay (100ms) + initialDelay * multiplier (200ms) = 300ms
    expect(duration).toBeGreaterThanOrEqual(300);
  });

  it('should respect max delay', async () => {
    const mockFn = jest.fn()
      .mockRejectedValueOnce(new Error('failure'))
      .mockResolvedValue('success');
    
    await retry(mockFn, {
      maxAttempts: 2,
      initialDelay: 1000,
      maxDelay: 500, // Max delay less than initial delay * multiplier
      backoffMultiplier: 10,
      name: 'test',
    });
    
    // Should work without issues
    expect(mockFn).toHaveBeenCalledTimes(2);
  });

  it('should only retry retryable errors', async () => {
    const mockFn = jest.fn().mockRejectedValue(new Error('ECONNREFUSED: Connection refused'));
    
    await expect(
      retry(mockFn, {
        maxAttempts: 3,
        initialDelay: 100,
        retryableErrors: ['ETIMEDOUT', 'ECONNRESET'], // ECONNREFUSED not in list
        name: 'test',
      })
    ).rejects.toThrow('ECONNREFUSED');
    
    // Should fail immediately without retry
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('should retry when error matches retryable errors', async () => {
    const mockFn = jest.fn()
      .mockRejectedValueOnce(new Error('ETIMEDOUT: Connection timeout'))
      .mockResolvedValue('success');
    
    const result = await retry(mockFn, {
      maxAttempts: 2,
      initialDelay: 100,
      retryableErrors: ['ETIMEDOUT'],
      name: 'test',
    });
    
    expect(result).toBe('success');
    expect(mockFn).toHaveBeenCalledTimes(2);
  });
});

describe('retryWithJitter', () => {
  it('should succeed on first attempt', async () => {
    const mockFn = jest.fn().mockResolvedValue('success');
    
    const result = await retryWithJitter(mockFn, {
      maxAttempts: 3,
      initialDelay: 100,
      name: 'test',
    });
    
    expect(result).toBe('success');
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('should retry with jitter and eventually succeed', async () => {
    const mockFn = jest.fn()
      .mockRejectedValueOnce(new Error('failure'))
      .mockResolvedValue('success');
    
    const result = await retryWithJitter(mockFn, {
      maxAttempts: 2,
      initialDelay: 100,
      name: 'test',
    });
    
    expect(result).toBe('success');
    expect(mockFn).toHaveBeenCalledTimes(2);
  });

  it('should add randomness to delay (jitter)', async () => {
    const mockFn = jest.fn()
      .mockRejectedValueOnce(new Error('failure'))
      .mockResolvedValue('success');
    
    const durations: number[] = [];
    
    // Run multiple times to check for variance
    for (let i = 0; i < 5; i++) {
      mockFn.mockClear();
      mockFn
        .mockRejectedValueOnce(new Error('failure'))
        .mockResolvedValue('success');
      
      const startTime = Date.now();
      await retryWithJitter(mockFn, {
        maxAttempts: 2,
        initialDelay: 100,
        name: 'test',
      });
      durations.push(Date.now() - startTime);
    }
    
    // Durations should vary due to jitter
    const uniqueDurations = new Set(durations);
    expect(uniqueDurations.size).toBeGreaterThan(1);
  });
});
