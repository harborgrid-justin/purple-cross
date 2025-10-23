import * as Sentry from '@sentry/node';
import { nodeProfilingIntegration } from '@sentry/profiling-node';

/**
 * Initialize Sentry error tracking and performance monitoring
 * Only active in production and staging environments
 */
export function initializeSentry(): void {
  const { NODE_ENV, SENTRY_DSN, SENTRY_ENVIRONMENT } = process.env;

  // Only initialize in production/staging
  if (!SENTRY_DSN || NODE_ENV === 'development') {
    return;
  }

  Sentry.init({
    dsn: SENTRY_DSN,
    environment: SENTRY_ENVIRONMENT || NODE_ENV || 'production',
    integrations: [nodeProfilingIntegration(), Sentry.expressIntegration()],
    // Lower sampling rate in production to reduce costs
    tracesSampleRate: NODE_ENV === 'production' ? 0.1 : 1.0,
    profilesSampleRate: NODE_ENV === 'production' ? 0.1 : 1.0,

    beforeSend(event) {
      // Remove sensitive data from events
      if (event.request) {
        // Remove cookies and auth headers
        delete event.request.cookies;
        if (event.request.headers) {
          delete event.request.headers.authorization;
          delete event.request.headers.cookie;
        }
      }

      // Filter out known noisy errors
      const errorMessage = event.exception?.values?.[0]?.value || '';
      if (errorMessage.includes('ECONNRESET') || errorMessage.includes('EPIPE')) {
        return null; // Don't send these errors
      }

      return event;
    },
  });
}

// Export Sentry for manual instrumentation
export { Sentry };
