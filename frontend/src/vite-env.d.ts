/**
 * WF-COMP-XXX | vite-env.d.ts - vite-env.d
 * Purpose: Utility module for vite-env.d
 * Dependencies: None
 * Last Updated: 2025-10-23 | File Type: .ts
 */

/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  /** Sentry DSN; when set, frontend error/observability reporting is enabled. */
  readonly VITE_SENTRY_DSN?: string;
  /** Environment label reported to Sentry (defaults to Vite mode). */
  readonly VITE_SENTRY_ENVIRONMENT?: string;
  /** App version, reported as the Sentry release. */
  readonly VITE_APP_VERSION?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
