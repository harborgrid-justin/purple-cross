import { logger } from '../../config/logger';
import { DeliveryResult, SmsMessage, SmsProvider } from '../types';

/**
 * No-op SMS provider for development/test and whenever no real SMS vendor is
 * configured. Logs (PII redacted by the logger) and reports success.
 */
export class LogSmsProvider implements SmsProvider {
  readonly name = 'log';

  async send(message: SmsMessage): Promise<DeliveryResult> {
    logger.info('SMS dispatched (log provider)', { to: message.to });
    return { provider: this.name, accepted: 1 };
  }
}
