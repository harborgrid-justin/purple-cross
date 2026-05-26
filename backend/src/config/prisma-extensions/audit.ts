import { Prisma } from '@prisma/client';
import { getContext, runAsSystem, type RequestContext } from '../../context/request-context';
import { logger } from '../logger';
import { STAMPED_MODELS, VERSIONED_MODELS, AUDITED_MODELS } from './models';

// Loose view of the operation args so we can stamp `data` regardless of model.
interface MutableArgs {
  data?: Record<string, unknown>;
}

function extractId(result: unknown): string | null {
  if (result && typeof result === 'object' && 'id' in result) {
    const id = (result as { id: unknown }).id;
    return typeof id === 'string' ? id : null;
  }
  return null;
}

/**
 * Prisma client extension providing, for the configured core models:
 *  - createdBy/updatedBy stamping from the request context
 *  - optimistic-locking `version` auto-increment on update
 *  - append-only AuditLog writes for create/update/delete
 *
 * Audit writes are best-effort: a logging failure is recorded but never blocks
 * the underlying mutation. The captured `client` is the pre-extension client,
 * so audit inserts do not recurse.
 */
export const auditExtension = Prisma.defineExtension((client) => {
  async function writeAudit(
    model: string,
    action: string,
    resourceId: string | null,
    changes: Record<string, unknown> | undefined,
    ctx: RequestContext | undefined
  ): Promise<void> {
    if (!AUDITED_MODELS.has(model)) {
      return;
    }
    try {
      await runAsSystem(() =>
        client.auditLog.create({
          data: {
            userId: ctx?.userId ?? 'system',
            action: `${model}.${action}`,
            resource: model,
            resourceId: resourceId ?? null,
            changes: changes
              ? (changes as unknown as Prisma.InputJsonValue)
              : undefined,
            metadata: {
              correlationId: ctx?.correlationId ?? null,
              tenantId: ctx?.tenantId ?? null,
            } as unknown as Prisma.InputJsonValue,
            ipAddress: ctx?.ip ?? null,
            userAgent: ctx?.userAgent ?? null,
            tenantId: ctx?.tenantId ?? null,
          },
        })
      );
    } catch (err) {
      logger.error('Audit log write failed', {
        model,
        action,
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }

  return client.$extends({
    name: 'audit-stamp-version',
    query: {
      $allModels: {
        async create({ model, args, query }) {
          const ctx = getContext();
          if (STAMPED_MODELS.has(model) && ctx?.userId) {
            const a = args as MutableArgs;
            a.data = { ...(a.data ?? {}), createdBy: ctx.userId, updatedBy: ctx.userId };
          }
          const result = await query(args);
          await writeAudit(model, 'create', extractId(result), (args as MutableArgs).data, ctx);
          return result;
        },
        async update({ model, args, query }) {
          const ctx = getContext();
          const a = args as MutableArgs;
          if (STAMPED_MODELS.has(model) && ctx?.userId) {
            a.data = { ...(a.data ?? {}), updatedBy: ctx.userId };
          }
          if (VERSIONED_MODELS.has(model)) {
            a.data = { ...(a.data ?? {}), version: { increment: 1 } };
          }
          const result = await query(args);
          await writeAudit(model, 'update', extractId(result), a.data, ctx);
          return result;
        },
        async delete({ model, args, query }) {
          const ctx = getContext();
          const result = await query(args);
          await writeAudit(model, 'delete', extractId(result), undefined, ctx);
          return result;
        },
      },
    },
  });
});
