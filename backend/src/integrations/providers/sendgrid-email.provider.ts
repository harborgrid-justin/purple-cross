import { DeliveryResult, EmailMessage, EmailProvider, ProviderError } from '../types';

/**
 * SendGrid v3 email provider. Selected automatically when `SENDGRID_API_KEY`
 * is configured. Uses the global `fetch` (Node >= 18) so no SDK dependency is
 * pulled in. The resilient facade is responsible for retry/circuit-breaking;
 * this class only translates a message into a SendGrid API call and maps the
 * response onto the shared `DeliveryResult` / `ProviderError` contract.
 */
export class SendGridEmailProvider implements EmailProvider {
  readonly name = 'sendgrid';
  private readonly endpoint = 'https://api.sendgrid.com/v3/mail/send';

  constructor(
    private readonly apiKey: string,
    private readonly defaultFrom: string
  ) {}

  async send(message: EmailMessage): Promise<DeliveryResult> {
    const recipients = Array.isArray(message.to) ? message.to : [message.to];
    const content = [{ type: 'text/plain', value: message.text }];
    if (message.html) {
      content.push({ type: 'text/html', value: message.html });
    }

    const body = {
      personalizations: [{ to: recipients.map((email) => ({ email })) }],
      from: { email: message.from || this.defaultFrom },
      subject: message.subject,
      content,
    };

    let response: Response;
    try {
      response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
    } catch (error) {
      // Network-level failure (DNS/timeout/reset) — retryable.
      throw new ProviderError(
        `SendGrid request failed: ${error instanceof Error ? error.message : String(error)}`
      );
    }

    if (!response.ok) {
      throw new ProviderError(
        `SendGrid responded with ${response.status} ${response.statusText}`,
        response.status
      );
    }

    return {
      provider: this.name,
      messageId: response.headers.get('x-message-id') ?? undefined,
      accepted: recipients.length,
    };
  }
}
