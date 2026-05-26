import { Prisma } from '@prisma/client';
import { SOFT_DELETE_MODELS } from './models';

interface WhereArgs {
  where?: Record<string, unknown>;
}

// Minimal delegate shape for rerouting deletes to updates on the base client.
interface SoftDeleteDelegate {
  update(args: { where: unknown; data: { deletedAt: Date } }): Promise<unknown>;
  updateMany(args: { where: unknown; data: { deletedAt: Date } }): Promise<unknown>;
}

function delegateFor(client: unknown, model: string): SoftDeleteDelegate {
  const prop = model.charAt(0).toLowerCase() + model.slice(1);
  return (client as Record<string, SoftDeleteDelegate>)[prop];
}

/** Inject `deletedAt: null` into a read's where, unless the caller set it. */
function excludeDeleted(args: WhereArgs): void {
  const where = args.where ?? {};
  if (!('deletedAt' in where)) {
    args.where = { ...where, deletedAt: null };
  }
}

function isDeleted(result: unknown): boolean {
  return (
    !!result &&
    typeof result === 'object' &&
    'deletedAt' in result &&
    (result as { deletedAt: unknown }).deletedAt != null
  );
}

/**
 * Soft-delete extension for the configured models:
 *  - reads (findMany/findFirst[OrThrow]/count/aggregate/groupBy/updateMany)
 *    exclude soft-deleted rows by default (opt out by passing `deletedAt`),
 *  - findUnique[OrThrow] post-filters soft-deleted rows,
 *  - delete/deleteMany are rerouted to set `deletedAt` instead of removing rows.
 *
 * Composed BEFORE the audit extension so a `delete()` call is still audited as a
 * delete while physically performing a soft delete.
 */
export const softDeleteExtension = Prisma.defineExtension((client) =>
  client.$extends({
    name: 'soft-delete',
    query: {
      $allModels: {
        async findMany({ model, args, query }) {
          if (SOFT_DELETE_MODELS.has(model)) excludeDeleted(args as WhereArgs);
          return query(args);
        },
        async findFirst({ model, args, query }) {
          if (SOFT_DELETE_MODELS.has(model)) excludeDeleted(args as WhereArgs);
          return query(args);
        },
        async findFirstOrThrow({ model, args, query }) {
          if (SOFT_DELETE_MODELS.has(model)) excludeDeleted(args as WhereArgs);
          return query(args);
        },
        async count({ model, args, query }) {
          if (SOFT_DELETE_MODELS.has(model)) excludeDeleted(args as WhereArgs);
          return query(args);
        },
        async aggregate({ model, args, query }) {
          if (SOFT_DELETE_MODELS.has(model)) excludeDeleted(args as WhereArgs);
          return query(args);
        },
        async groupBy({ model, args, query }) {
          if (SOFT_DELETE_MODELS.has(model)) excludeDeleted(args as WhereArgs);
          return query(args);
        },
        async updateMany({ model, args, query }) {
          if (SOFT_DELETE_MODELS.has(model)) excludeDeleted(args as WhereArgs);
          return query(args);
        },
        async findUnique({ model, args, query }) {
          const result = await query(args);
          if (SOFT_DELETE_MODELS.has(model) && isDeleted(result)) return null;
          return result;
        },
        async findUniqueOrThrow({ model, args, query }) {
          const result = await query(args);
          if (SOFT_DELETE_MODELS.has(model) && isDeleted(result)) {
            throw new Prisma.PrismaClientKnownRequestError('No record found', {
              code: 'P2025',
              clientVersion: Prisma.prismaVersion.client,
            });
          }
          return result;
        },
        async delete({ model, args, query }) {
          if (!SOFT_DELETE_MODELS.has(model)) return query(args);
          return delegateFor(client, model).update({
            where: (args as WhereArgs).where,
            data: { deletedAt: new Date() },
          });
        },
        async deleteMany({ model, args, query }) {
          if (!SOFT_DELETE_MODELS.has(model)) return query(args);
          const where = (args as WhereArgs).where ?? {};
          return delegateFor(client, model).updateMany({
            where: { ...where, deletedAt: null },
            data: { deletedAt: new Date() },
          });
        },
      },
    },
  })
);
