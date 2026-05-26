import { AsyncLocalStorage } from 'node:async_hooks';

/**
 * Ambient, per-request context propagated via AsyncLocalStorage. Populated by
 * `requestContextMiddleware` (correlation id / ip / user-agent) and enriched by
 * the auth middleware (userId / role / tenantId). Prisma client extensions read
 * this at query time to stamp audit fields, scope tenants, etc.
 */
export interface RequestContext {
  correlationId?: string;
  userId?: string;
  role?: string;
  tenantId?: string;
  ip?: string;
  userAgent?: string;
  /** True for trusted background/system work that bypasses tenant scoping. */
  system?: boolean;
}

const storage = new AsyncLocalStorage<RequestContext>();

export function runWithContext<T>(ctx: RequestContext, fn: () => T): T {
  return storage.run(ctx, fn);
}

export function getContext(): RequestContext | undefined {
  return storage.getStore();
}

/**
 * Run `fn` in a "system" context: no tenant scoping and no audit recursion.
 * Use for background jobs, the pre-auth login lookup, and the audit writer.
 */
export function runAsSystem<T>(fn: () => T): T {
  const current = storage.getStore();
  return storage.run({ ...current, system: true, tenantId: undefined }, fn);
}
