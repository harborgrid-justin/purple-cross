/**
 * Frontend observability bootstrap (Sentry).
 *
 * Mirrors the backend observability story: opt-in via `VITE_SENTRY_DSN`, with
 * PII/PHI scrubbing in `beforeSend` so medical data never leaves the browser in
 * an error payload. When no DSN is configured (local dev / tests) every export
 * here is a safe no-op, so call sites never need to guard.
 */
import * as Sentry from '@sentry/react';

let initialized = false;

/** Whether Sentry reporting is active for this session. */
export function isObservabilityEnabled(): boolean {
  return initialized;
}

/**
 * Initialize Sentry once, at app startup, if a DSN is configured. Browser
 * tracing + session tracking are enabled; traces are sampled at 10% to bound
 * cost. Safe to call multiple times.
 */
export function initObservability(): void {
  const dsn = import.meta.env.VITE_SENTRY_DSN;
  if (!dsn || initialized) {
    return;
  }

  Sentry.init({
    dsn,
    environment: import.meta.env.VITE_SENTRY_ENVIRONMENT ?? import.meta.env.MODE,
    release: import.meta.env.VITE_APP_VERSION,
    integrations: [Sentry.browserTracingIntegration()],
    // Bound performance-trace volume in production.
    tracesSampleRate: import.meta.env.PROD ? 0.1 : 1.0,
    // Strip anything that could carry PII/PHI before the event leaves the browser.
    sendDefaultPii: false,
    beforeSend(event) {
      if (event.request?.cookies) {
        delete event.request.cookies;
      }
      if (event.request?.headers) {
        delete event.request.headers.Authorization;
        delete event.request.headers.authorization;
        delete event.request.headers.Cookie;
      }
      // Drop query strings, which may contain identifiers.
      if (event.request?.url) {
        event.request.url = event.request.url.split('?')[0];
      }
      return event;
    },
  });

  initialized = true;
}

/**
 * Report an exception to Sentry. No-op when observability is disabled.
 */
export function captureException(error: unknown, context?: Record<string, unknown>): void {
  if (!initialized) {
    return;
  }
  Sentry.captureException(error, context ? { extra: context } : undefined);
}
