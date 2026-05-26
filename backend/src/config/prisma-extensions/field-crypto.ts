import { Prisma } from '@prisma/client';
import { encryptField, decryptField } from '../../utils/field-crypto';

/**
 * Per-model list of free-text columns encrypted at rest. Only non-indexed,
 * non-unique, non-searched columns may be listed (encryption breaks ordering
 * and equality lookups). Start with clinical PHI on MedicalRecord.
 */
const ENCRYPTED_FIELDS: Record<string, string[]> = {
  MedicalRecord: ['chiefComplaint', 'diagnosis', 'treatment', 'notes'],
};

function encryptData(model: string, data: unknown): void {
  const fields = ENCRYPTED_FIELDS[model];
  if (!fields || !data || typeof data !== 'object') {
    return;
  }
  const record = data as Record<string, unknown>;
  for (const field of fields) {
    const value = record[field];
    if (typeof value === 'string' && value.length > 0) {
      record[field] = encryptField(value);
    }
  }
}

function decryptResult(model: string, result: unknown): void {
  const fields = ENCRYPTED_FIELDS[model];
  if (!fields || !result) {
    return;
  }
  const records = Array.isArray(result) ? result : [result];
  for (const rec of records) {
    if (!rec || typeof rec !== 'object') continue;
    const record = rec as Record<string, unknown>;
    for (const field of fields) {
      const value = record[field];
      if (typeof value === 'string') {
        record[field] = decryptField(value);
      }
    }
  }
}

/**
 * Field-level encryption extension. Encrypts configured columns on write and
 * decrypts them on read. Composed innermost so ciphertext is what actually hits
 * the database (and what audit/log layers above see), while callers transparently
 * receive plaintext.
 */
export const fieldCryptoExtension = Prisma.defineExtension((client) =>
  client.$extends({
    name: 'field-crypto',
    query: {
      $allModels: {
        async create({ model, args, query }) {
          encryptData(model, (args as { data?: unknown }).data);
          const result = await query(args);
          decryptResult(model, result);
          return result;
        },
        async update({ model, args, query }) {
          encryptData(model, (args as { data?: unknown }).data);
          const result = await query(args);
          decryptResult(model, result);
          return result;
        },
        async upsert({ model, args, query }) {
          const a = args as { create?: unknown; update?: unknown };
          encryptData(model, a.create);
          encryptData(model, a.update);
          const result = await query(args);
          decryptResult(model, result);
          return result;
        },
        async findUnique({ model, args, query }) {
          const result = await query(args);
          decryptResult(model, result);
          return result;
        },
        async findUniqueOrThrow({ model, args, query }) {
          const result = await query(args);
          decryptResult(model, result);
          return result;
        },
        async findFirst({ model, args, query }) {
          const result = await query(args);
          decryptResult(model, result);
          return result;
        },
        async findFirstOrThrow({ model, args, query }) {
          const result = await query(args);
          decryptResult(model, result);
          return result;
        },
        async findMany({ model, args, query }) {
          const result = await query(args);
          decryptResult(model, result);
          return result;
        },
      },
    },
  })
);
