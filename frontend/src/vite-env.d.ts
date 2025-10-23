/**
 * WF-COMP-XXX | vite-env.d.ts - vite-env.d
 * Purpose: Utility module for vite-env.d
 * Dependencies: None
 * Last Updated: 2025-10-23 | File Type: .ts
 */

/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
