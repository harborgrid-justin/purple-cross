import { DeliveryResult, ProviderError, SmsMessage, SmsProvider } from '../types';

interface TwilioMessageResponse {
  sid?: string;
}

/**
 * Twilio SMS provider. Selected automatically when `TWILIO_ACCOUNT_SID`,
 * `TWILIO_AUTH_TOKEN`, and `TWILIO_FROM_NUMBER` are configured. Uses the global
 * `fetch` (Node >= 18) with HTTP Basic auth and form-encoded body, mapping the
 * response onto the shared `DeliveryResult` / `ProviderError` contract. The
 * resilient facade handles retry/circuit-breaking.
 */
export class TwilioSmsProvider implements SmsProvider {
  readonly name = 'twilio';
  private readonly endpoint: string;
  private readonly authHeader: string;

  constructor(
    accountSid: string,
    authToken: string,
    private readonly fromNumber: string
  ) {
    this.endpoint = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
    this.authHeader = `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString('base64')}`;
  }

  async send(message: SmsMessage): Promise<DeliveryResult> {
    const form = new URLSearchParams({
      To: message.to,
      From: message.from || this.fromNumber,
      Body: message.body,
    });

    let response: Response;
    try {
      response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          Authorization: this.authHeader,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: form.toString(),
      });
    } catch (error) {
      throw new ProviderError(
        `Twilio request failed: ${error instanceof Error ? error.message : String(error)}`
      );
    }

    if (!response.ok) {
      throw new ProviderError(
        `Twilio responded with ${response.status} ${response.statusText}`,
        response.status
      );
    }

    const payload = (await response.json().catch(() => ({}))) as TwilioMessageResponse;
    return { provider: this.name, messageId: payload.sid, accepted: 1 };
  }
}
