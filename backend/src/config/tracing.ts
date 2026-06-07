import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { logger } from './logger';

/**
 * OpenTelemetry distributed tracing bootstrap.
 *
 * This module MUST be imported before any instrumented library (express, http,
 * pg, ioredis, …) so the auto-instrumentations can patch them at require time.
 * `index.ts` / `worker.ts` import it on their very first line.
 *
 * Tracing is opt-in: it only starts when `OTEL_ENABLED=true` (and never under
 * `NODE_ENV=test`). Spans are exported over OTLP/HTTP to the collector named by
 * `OTEL_EXPORTER_OTLP_ENDPOINT` (default `http://localhost:4318`). When disabled
 * the SDK is never constructed, so there is zero runtime overhead.
 */

let sdk: NodeSDK | undefined;

/**
 * Whether distributed tracing is enabled for this process.
 */
export function isTracingEnabled(): boolean {
  return process.env.OTEL_ENABLED === 'true' && process.env.NODE_ENV !== 'test';
}

/**
 * Start the OpenTelemetry Node SDK if tracing is enabled. Idempotent: a second
 * call is a no-op. Safe to call even when the OTLP collector is unreachable —
 * the exporter buffers/drops spans and never blocks the request path.
 */
export function startTracing(): void {
  if (sdk || !isTracingEnabled()) {
    return;
  }

  // Let the SDK derive the service name from OTEL_SERVICE_NAME so we do not need
  // to pull in @opentelemetry/resources / semantic-conventions here.
  process.env.OTEL_SERVICE_NAME = process.env.OTEL_SERVICE_NAME || 'purple-cross-api';

  try {
    sdk = new NodeSDK({
      traceExporter: new OTLPTraceExporter(),
      instrumentations: [
        getNodeAutoInstrumentations({
          // File-system spans are extremely noisy and rarely actionable.
          '@opentelemetry/instrumentation-fs': { enabled: false },
        }),
      ],
    });

    sdk.start();

    logger.info('OpenTelemetry tracing started', {
      service: process.env.OTEL_SERVICE_NAME,
      endpoint: process.env.OTEL_EXPORTER_OTLP_ENDPOINT || 'http://localhost:4318',
    });
  } catch (error) {
    // Tracing must never take the process down.
    logger.error('Failed to start OpenTelemetry tracing', {
      error: error instanceof Error ? error.message : String(error),
    });
    sdk = undefined;
  }
}

/**
 * Flush and shut down the tracing SDK. Called during graceful shutdown so the
 * final batch of spans is exported before the process exits.
 */
export async function stopTracing(): Promise<void> {
  if (!sdk) {
    return;
  }
  try {
    await sdk.shutdown();
    logger.info('OpenTelemetry tracing shut down');
  } catch (error) {
    logger.warn('Error shutting down OpenTelemetry tracing', {
      error: error instanceof Error ? error.message : String(error),
    });
  } finally {
    sdk = undefined;
  }
}

// Start eagerly on import so instrumentation is installed before express/pg/etc.
startTracing();
