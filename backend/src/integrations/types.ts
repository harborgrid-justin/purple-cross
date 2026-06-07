/**
 * Outbound integration provider contracts.
 *
 * The platform talks to third-party messaging providers (email, SMS) through
 * these narrow interfaces so the concrete vendor (SendGrid, Twilio, …) can be
 * swapped via configuration without touching call sites. The resilient facade
 * in `notification.service.ts` wraps every provider call in a circuit breaker +
 * retry so a flaky provider never cascades into the request/queue path.
 */

/** A transactional email to deliver. */
export interface EmailMessage {
  to: string | string[];
  subject: string;
  /** Plain-text body (always supplied; HTML is optional). */
  text: string;
  html?: string;
  /** Optional override of the configured default from-address. */
  from?: string;
}

/** A single SMS/text message to deliver. */
export interface SmsMessage {
  to: string;
  body: string;
  /** Optional override of the configured default sender id / number. */
  from?: string;
}

/** Normalized result returned by every provider, regardless of vendor. */
export interface DeliveryResult {
  /** Provider/runtime that handled the send (e.g. `sendgrid`, `log`). */
  provider: string;
  /** Vendor message id when available; `undefined` for no-op providers. */
  messageId?: string;
  /** Number of recipients the send fanned out to. */
  accepted: number;
}

/** Email delivery provider. Implementations must be side-effect-free on import. */
export interface EmailProvider {
  readonly name: string;
  send(message: EmailMessage): Promise<DeliveryResult>;
}

/** SMS delivery provider. */
export interface SmsProvider {
  readonly name: string;
  send(message: SmsMessage): Promise<DeliveryResult>;
}

/**
 * Error thrown when a provider returns a non-success HTTP status. Carries the
 * status so the resilient facade can decide whether the failure is retryable
 * (5xx / 429) or terminal (4xx).
 */
export class ProviderError extends Error {
  constructor(
    message: string,
    public readonly statusCode?: number
  ) {
    super(message);
    this.name = 'ProviderError';
  }

  /** 429 + 5xx are transient and worth retrying; other 4xx are not. */
  get retryable(): boolean {
    if (this.statusCode === undefined) return true; // network error
    return this.statusCode === 429 || this.statusCode >= 500;
  }
}
