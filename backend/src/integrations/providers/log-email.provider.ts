import { logger } from '../../config/logger';
import { DeliveryResult, EmailMessage, EmailProvider } from '../types';

/**
 * No-op email provider used in development/test and whenever no real email
 * vendor is configured. It logs (with PII redaction handled by the logger) and
 * reports success so local flows behave end-to-end without external calls.
 */
export class LogEmailProvider implements EmailProvider {
  readonly name = 'log';

  async send(message: EmailMessage): Promise<DeliveryResult> {
    const recipients = Array.isArray(message.to) ? message.to : [message.to];
    logger.info('Email dispatched (log provider)', {
      to: message.to,
      subject: message.subject,
    });
    return { provider: this.name, accepted: recipients.length };
  }
}
