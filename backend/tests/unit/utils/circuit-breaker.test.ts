import { CircuitBreaker, createCircuitBreaker } from '../../../src/utils/circuit-breaker';

describe('CircuitBreaker', () => {
  let breaker: CircuitBreaker;

  beforeEach(() => {
    breaker = createCircuitBreaker('test-breaker', {
      failureThreshold: 3,
      successThreshold: 2,
      timeout: 1000,
    });
  });

  describe('execute', () => {
    it('should execute function successfully when circuit is closed', async () => {
      const mockFn = jest.fn().mockResolvedValue('success');

      const result = await breaker.execute(mockFn);

      expect(result).toBe('success');
      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(breaker.getState()).toBe('CLOSED');
    });

    it('should open circuit after failure threshold is reached', async () => {
      const mockFn = jest.fn().mockRejectedValue(new Error('failure'));

      // Trigger failures
      for (let i = 0; i < 3; i++) {
        await expect(breaker.execute(mockFn)).rejects.toThrow('failure');
      }

      expect(breaker.getState()).toBe('OPEN');
    });

    it('should reject requests when circuit is open', async () => {
      const mockFn = jest.fn().mockRejectedValue(new Error('failure'));

      // Open the circuit
      for (let i = 0; i < 3; i++) {
        await expect(breaker.execute(mockFn)).rejects.toThrow();
      }

      // Try to execute when circuit is open
      await expect(breaker.execute(mockFn)).rejects.toThrow('Circuit breaker is OPEN');
    });

    it('should transition to half-open after timeout', async () => {
      const mockFn = jest
        .fn()
        .mockRejectedValueOnce(new Error('failure'))
        .mockRejectedValueOnce(new Error('failure'))
        .mockRejectedValueOnce(new Error('failure'))
        .mockResolvedValue('success');

      // Open the circuit
      for (let i = 0; i < 3; i++) {
        await expect(breaker.execute(mockFn)).rejects.toThrow('failure');
      }

      expect(breaker.getState()).toBe('OPEN');

      // Wait for timeout
      await new Promise((resolve) => setTimeout(resolve, 1100));

      // Should transition to half-open and succeed
      const result = await breaker.execute(mockFn);
      expect(result).toBe('success');
    });

    it('should close circuit after success threshold in half-open state', async () => {
      const mockFn = jest
        .fn()
        .mockRejectedValueOnce(new Error('failure'))
        .mockRejectedValueOnce(new Error('failure'))
        .mockRejectedValueOnce(new Error('failure'))
        .mockResolvedValue('success');

      // Open the circuit
      for (let i = 0; i < 3; i++) {
        await expect(breaker.execute(mockFn)).rejects.toThrow('failure');
      }

      // Wait for timeout
      await new Promise((resolve) => setTimeout(resolve, 1100));

      // Execute success threshold times
      await breaker.execute(mockFn);
      await breaker.execute(mockFn);

      expect(breaker.getState()).toBe('CLOSED');
    });
  });

  describe('getStats', () => {
    it('should return circuit breaker statistics', () => {
      const stats = breaker.getStats();

      expect(stats).toHaveProperty('name', 'test-breaker');
      expect(stats).toHaveProperty('state', 'CLOSED');
      expect(stats).toHaveProperty('failureCount', 0);
      expect(stats).toHaveProperty('successCount', 0);
    });
  });

  describe('reset', () => {
    it('should reset circuit breaker to closed state', async () => {
      const mockFn = jest.fn().mockRejectedValue(new Error('failure'));

      // Open the circuit
      for (let i = 0; i < 3; i++) {
        await expect(breaker.execute(mockFn)).rejects.toThrow();
      }

      expect(breaker.getState()).toBe('OPEN');

      // Reset
      breaker.reset();

      expect(breaker.getState()).toBe('CLOSED');
      expect(breaker.getStats().failureCount).toBe(0);
    });
  });
});

describe('createCircuitBreaker', () => {
  it('should create circuit breaker with default config', () => {
    const breaker = createCircuitBreaker('test');
    const stats = breaker.getStats();

    expect(stats.name).toBe('test');
    expect(stats.state).toBe('CLOSED');
  });

  it('should create circuit breaker with custom config', () => {
    const breaker = createCircuitBreaker('test', {
      failureThreshold: 10,
      successThreshold: 5,
    });

    expect(breaker).toBeInstanceOf(CircuitBreaker);
  });
});
