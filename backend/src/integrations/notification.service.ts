import { CircuitBreaker, createCircuitBreaker } from '../utils/circuit-breaker';
import { retry } from '../utils/retry';
import { logger } from '../config/logger';
import {
  circuitBreakerState,
  externalRequestDuration,
  externalRequestsTotal,
} from '../config/metrics';
import { LogEmailProvider } from './providers/log-email.provider';
import { SendGridEmailProvider } from './providers/sendgrid-email.provider';
import { LogSmsProvider } from './providers/log-sms.provider';
import { TwilioSmsProvider } from './providers/twilio-sms.provider';
import {
  DeliveryResult,
  EmailMessage,
  EmailProvider,
  ProviderError,
  SmsMessage,
  SmsProvider,
} from './types';

/**
 * Resilient notification facade.
 *
 * This is the single seam through which the platform sends email/SMS. It picks
 * a concrete provider from configuration and wraps every outbound call in a
 * **circuit breaker** (per provider, to stop hammering a downed vendor) plus
 * **retry with exponential backoff** (for transient 429/5xx/network blips),
 * recording Prometheus metrics for each attempt. Call sites (queue jobs,
 * services) depend only on `sendEmail` / `sendSms` and never touch a vendor SDK.
 */

/** Number of attempts per provider call; read at call time so it is tunable. */
function retryAttempts(): number {
  return Number(process.env.INTEGRATION_RETRY_ATTEMPTS || 3);
}

function stateToGauge(state: string): number {
  if (state === 'OPEN') return 2;
  if (state === 'HALF_OPEN') return 1;
  return 0;
}

/** Constructor overrides, primarily for tests / explicit wiring. */
export interface NotificationServiceOptions {
  emailProvider?: EmailProvider;
  smsProvider?: SmsProvider;
}

class NotificationService {
  private emailProviderInstance?: EmailProvider;
  private smsProviderInstance?: SmsProvider;
  private readonly breakers = new Map<string, CircuitBreaker>();

  constructor(private readonly options: NotificationServiceOptions = {}) {}

  /** Resolve (once) the configured email provider. */
  private get emailProvider(): EmailProvider {
    if (!this.emailProviderInstance) {
      const apiKey = process.env.SENDGRID_API_KEY;
      const from = process.env.EMAIL_FROM || process.env.SENDGRID_FROM_EMAIL;
      this.emailProviderInstance =
        this.options.emailProvider ??
        (apiKey && from ? new SendGridEmailProvider(apiKey, from) : new LogEmailProvider());
      logger.info('Email provider selected', { provider: this.emailProviderInstance.name });
    }
    return this.emailProviderInstance;
  }

  /** Resolve (once) the configured SMS provider. */
  private get smsProvider(): SmsProvider {
    if (!this.smsProviderInstance) {
      const sid = process.env.TWILIO_ACCOUNT_SID;
      const token = process.env.TWILIO_AUTH_TOKEN;
      const from = process.env.TWILIO_PHONE_NUMBER;
      this.smsProviderInstance =
        this.options.smsProvider ??
        (sid && token && from ? new TwilioSmsProvider(sid, token, from) : new LogSmsProvider());
      logger.info('SMS provider selected', { provider: this.smsProviderInstance.name });
    }
    return this.smsProviderInstance;
  }

  private breakerFor(name: string): CircuitBreaker {
    let breaker = this.breakers.get(name);
    if (!breaker) {
      breaker = createCircuitBreaker(name);
      this.breakers.set(name, breaker);
    }
    return breaker;
  }

  /** Send a transactional email through the resilient pipeline. */
  async sendEmail(message: EmailMessage): Promise<DeliveryResult> {
    return this.dispatch('email', this.emailProvider.name, () => this.emailProvider.send(message));
  }

  /** Send an SMS through the resilient pipeline. */
  async sendSms(message: SmsMessage): Promise<DeliveryResult> {
    return this.dispatch('sms', this.smsProvider.name, () => this.smsProvider.send(message));
  }

  /**
   * Execute a provider call with circuit-breaker + retry, emitting metrics for
   * the attempt. Only transient (`ProviderError.retryable`) failures are
   * retried; terminal 4xx errors fail fast. A breaker-open rejection surfaces as
   * an `outcome=rejected` metric rather than `failure`.
   */
  private async dispatch(
    operation: 'email' | 'sms',
    provider: string,
    send: () => Promise<DeliveryResult>
  ): Promise<DeliveryResult> {
    const breaker = this.breakerFor(`${provider}:${operation}`);
    const startedAt = Date.now();

    try {
      const result = await breaker.execute(() =>
        retry(send, {
          maxAttempts: retryAttempts(),
          name: `${provider}.${operation}`,
          shouldRetry: (error) => !(error instanceof ProviderError) || error.retryable,
        })
      );
      this.record(provider, operation, 'success', startedAt, breaker);
      return result;
    } catch (error) {
      const rejected = error instanceof Error && error.message.includes('Circuit breaker is OPEN');
      this.record(provider, operation, rejected ? 'rejected' : 'failure', startedAt, breaker);
      throw error;
    }
  }

  private record(
    provider: string,
    operation: string,
    outcome: 'success' | 'failure' | 'rejected',
    startedAt: number,
    breaker: CircuitBreaker
  ): void {
    const labels = { provider, operation, outcome };
    externalRequestsTotal.inc(labels);
    externalRequestDuration.observe(labels, (Date.now() - startedAt) / 1000);
    circuitBreakerState.set({ breaker: breaker.getStats().name }, stateToGauge(breaker.getState()));
  }

  /** Reset memoized providers/breakers. Test-only seam. */
  reset(): void {
    this.emailProviderInstance = undefined;
    this.smsProviderInstance = undefined;
    this.breakers.clear();
  }
}

export const notificationService = new NotificationService();
export { NotificationService };
