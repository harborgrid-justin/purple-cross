import { NotificationService } from '../../../src/integrations/notification.service';
import {
  DeliveryResult,
  EmailMessage,
  EmailProvider,
  ProviderError,
} from '../../../src/integrations/types';

// Silence structured logging during the suite.
jest.mock('../../../src/config/logger', () => ({
  logger: { info: jest.fn(), warn: jest.fn(), error: jest.fn() },
}));

/** Controllable fake email provider for asserting the resilient pipeline. */
class FakeEmailProvider implements EmailProvider {
  readonly name = 'fake';
  send: jest.Mock<Promise<DeliveryResult>, [EmailMessage]>;

  constructor(impl: (message: EmailMessage) => Promise<DeliveryResult>) {
    this.send = jest.fn(impl);
  }
}

const message: EmailMessage = {
  to: 'owner@example.com',
  subject: 'Appointment reminder',
  text: 'Your appointment is tomorrow.',
};

describe('NotificationService (resilient facade)', () => {
  const originalAttempts = process.env.INTEGRATION_RETRY_ATTEMPTS;

  afterEach(() => {
    if (originalAttempts === undefined) {
      delete process.env.INTEGRATION_RETRY_ATTEMPTS;
    } else {
      process.env.INTEGRATION_RETRY_ATTEMPTS = originalAttempts;
    }
  });

  it('selects the log provider by default and reports delivery', async () => {
    const service = new NotificationService();
    const result = await service.sendEmail(message);
    expect(result.provider).toBe('log');
    expect(result.accepted).toBe(1);
  });

  it('routes through an injected provider and counts recipients', async () => {
    process.env.INTEGRATION_RETRY_ATTEMPTS = '1';
    const provider = new FakeEmailProvider(async () => ({
      provider: 'fake',
      messageId: 'm-1',
      accepted: 2,
    }));
    const service = new NotificationService({ emailProvider: provider });

    const result = await service.sendEmail({ ...message, to: ['a@x.com', 'b@x.com'] });

    expect(provider.send).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ provider: 'fake', messageId: 'm-1', accepted: 2 });
  });

  it('retries a transient (retryable) provider failure and then succeeds', async () => {
    process.env.INTEGRATION_RETRY_ATTEMPTS = '3';
    let calls = 0;
    const provider = new FakeEmailProvider(async () => {
      calls += 1;
      if (calls === 1) {
        throw new ProviderError('upstream 503', 503); // retryable
      }
      return { provider: 'fake', accepted: 1 };
    });
    const service = new NotificationService({ emailProvider: provider });

    const result = await service.sendEmail(message);

    expect(provider.send).toHaveBeenCalledTimes(2);
    expect(result.accepted).toBe(1);
  }, 15000);

  it('does not retry a terminal (4xx) provider failure', async () => {
    process.env.INTEGRATION_RETRY_ATTEMPTS = '3';
    const provider = new FakeEmailProvider(async () => {
      throw new ProviderError('bad request', 400); // not retryable
    });
    const service = new NotificationService({ emailProvider: provider });

    await expect(service.sendEmail(message)).rejects.toThrow('bad request');
    expect(provider.send).toHaveBeenCalledTimes(1);
  });

  it('opens the circuit breaker after repeated failures and rejects fast', async () => {
    process.env.INTEGRATION_RETRY_ATTEMPTS = '1'; // no backoff delays
    const provider = new FakeEmailProvider(async () => {
      throw new ProviderError('upstream down', 500); // retryable, but attempts=1
    });
    const service = new NotificationService({ emailProvider: provider });

    // Default failureThreshold is 5 — five dispatches trip the breaker.
    for (let i = 0; i < 5; i++) {
      await expect(service.sendEmail(message)).rejects.toThrow('upstream down');
    }
    expect(provider.send).toHaveBeenCalledTimes(5);

    // The 6th call short-circuits without touching the provider.
    await expect(service.sendEmail(message)).rejects.toThrow('Circuit breaker is OPEN');
    expect(provider.send).toHaveBeenCalledTimes(5);
  });
});
