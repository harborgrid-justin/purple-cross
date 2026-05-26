import { Prisma } from '@prisma/client';
import { getContext } from '../../context/request-context';
import { AppError } from '../../middleware/error-handler';
import { HTTP_STATUS } from '../../constants';
import { TENANT_MODELS } from './models';

interface WhereArgs {
  where?: Record<string, unknown>;
}
interface DataArgs {
  data?: Record<string, unknown> | Record<string, unknown>[];
}

/**
 * Resolve the tenant scope for the current request:
 *  - no context or system context  -> not enforced (trusted background work),
 *  - context with a tenantId        -> scope to it,
 *  - authenticated context without a tenantId -> fail closed (403).
 */
function tenantScope(): { tenantId?: string; enforce: boolean } {
  const ctx = getContext();
  if (!ctx || ctx.system) {
    return { enforce: false };
  }
  if (!ctx.tenantId) {
    throw new AppError('Tenant context required', HTTP_STATUS.FORBIDDEN);
  }
  return { tenantId: ctx.tenantId, enforce: true };
}

function injectWhere(args: WhereArgs, tenantId: string): void {
  args.where = { ...(args.where ?? {}), tenantId };
}

/**
 * Tenant isolation extension. For tenant-scoped models it injects the caller's
 * tenantId into reads/bulk-writes, sets it on creates, and post-filters
 * findUnique results. Fails closed for authenticated requests that lack a
 * tenant. Background/system work (no ALS context, or runAsSystem) is unscoped.
 */
export const tenantExtension = Prisma.defineExtension((client) =>
  client.$extends({
    name: 'tenant-isolation',
    query: {
      $allModels: {
        async findMany({ model, args, query }) {
          if (TENANT_MODELS.has(model)) {
            const s = tenantScope();
            if (s.enforce) injectWhere(args as WhereArgs, s.tenantId as string);
          }
          return query(args);
        },
        async findFirst({ model, args, query }) {
          if (TENANT_MODELS.has(model)) {
            const s = tenantScope();
            if (s.enforce) injectWhere(args as WhereArgs, s.tenantId as string);
          }
          return query(args);
        },
        async findFirstOrThrow({ model, args, query }) {
          if (TENANT_MODELS.has(model)) {
            const s = tenantScope();
            if (s.enforce) injectWhere(args as WhereArgs, s.tenantId as string);
          }
          return query(args);
        },
        async count({ model, args, query }) {
          if (TENANT_MODELS.has(model)) {
            const s = tenantScope();
            if (s.enforce) injectWhere(args as WhereArgs, s.tenantId as string);
          }
          return query(args);
        },
        async aggregate({ model, args, query }) {
          if (TENANT_MODELS.has(model)) {
            const s = tenantScope();
            if (s.enforce) injectWhere(args as WhereArgs, s.tenantId as string);
          }
          return query(args);
        },
        async groupBy({ model, args, query }) {
          if (TENANT_MODELS.has(model)) {
            const s = tenantScope();
            if (s.enforce) injectWhere(args as WhereArgs, s.tenantId as string);
          }
          return query(args);
        },
        async updateMany({ model, args, query }) {
          if (TENANT_MODELS.has(model)) {
            const s = tenantScope();
            if (s.enforce) injectWhere(args as WhereArgs, s.tenantId as string);
          }
          return query(args);
        },
        async deleteMany({ model, args, query }) {
          if (TENANT_MODELS.has(model)) {
            const s = tenantScope();
            if (s.enforce) injectWhere(args as WhereArgs, s.tenantId as string);
          }
          return query(args);
        },
        async create({ model, args, query }) {
          if (TENANT_MODELS.has(model)) {
            const s = tenantScope();
            if (s.enforce) {
              const a = args as DataArgs;
              if (a.data && !Array.isArray(a.data) && !('tenantId' in a.data)) {
                a.data = { ...a.data, tenantId: s.tenantId };
              }
            }
          }
          return query(args);
        },
        async createMany({ model, args, query }) {
          if (TENANT_MODELS.has(model)) {
            const s = tenantScope();
            if (s.enforce) {
              const a = args as DataArgs;
              if (Array.isArray(a.data)) {
                a.data = a.data.map((d) => ('tenantId' in d ? d : { ...d, tenantId: s.tenantId }));
              } else if (a.data && !('tenantId' in a.data)) {
                a.data = { ...a.data, tenantId: s.tenantId };
              }
            }
          }
          return query(args);
        },
        async findUnique({ model, args, query }) {
          const result = await query(args);
          if (TENANT_MODELS.has(model) && result) {
            const ctx = getContext();
            if (
              ctx &&
              !ctx.system &&
              ctx.tenantId &&
              (result as { tenantId?: string }).tenantId !== ctx.tenantId
            ) {
              return null;
            }
          }
          return result;
        },
      },
    },
  })
);
