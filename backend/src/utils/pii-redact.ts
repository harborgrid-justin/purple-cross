/**
 * PII / PHI redaction for logs and error reports. Healthcare data (vet medical
 * records, prescriptions) and credentials must not leak into log files or
 * error-tracking. Redaction is key-based and recursive.
 */

const REDACTED = '[REDACTED]';
const MAX_DEPTH = 8;

// Fully removed (credentials, secrets, tokens).
const SECRET_KEYS = new Set([
  'password',
  'passwordhash',
  'password_hash',
  'currentpassword',
  'newpassword',
  'token',
  'accesstoken',
  'refreshtoken',
  'authorization',
  'cookie',
  'secret',
  'jwt',
  'jwtsecret',
  'twofactorsecret',
  'apikey',
  'api_key',
  'cardnumber',
  'cvv',
  'ssn',
]);

// Protected health / personal info that gets masked rather than fully removed
// where a partial value aids debugging.
const PHI_KEYS = new Set(['diagnosis', 'treatment', 'notes', 'emergencycontact', 'microchipid']);
const EMAIL_KEYS = new Set(['email']);
const PHONE_KEYS = new Set(['phone', 'emergencyphone', 'phonenumber']);

function maskEmail(value: unknown): unknown {
  if (typeof value !== 'string' || !value.includes('@')) {
    return REDACTED;
  }
  const [local, domain] = value.split('@');
  const head = local.length > 0 ? local[0] : '';
  return `${head}***@${domain}`;
}

function maskPhone(value: unknown): unknown {
  if (typeof value !== 'string') {
    return REDACTED;
  }
  const digits = value.replace(/\D/g, '');
  return digits.length >= 4 ? `***${digits.slice(-4)}` : REDACTED;
}

function maskByKey(key: string, value: unknown): unknown {
  if (SECRET_KEYS.has(key)) return REDACTED;
  if (EMAIL_KEYS.has(key)) return maskEmail(value);
  if (PHONE_KEYS.has(key)) return maskPhone(value);
  if (PHI_KEYS.has(key)) return REDACTED;
  return value;
}

function isSensitiveKey(key: string): boolean {
  const k = key.toLowerCase();
  return SECRET_KEYS.has(k) || EMAIL_KEYS.has(k) || PHONE_KEYS.has(k) || PHI_KEYS.has(k);
}

/** Returns a redacted deep copy of `value` (objects/arrays are not mutated). */
export function redactDeep(value: unknown, depth = 0): unknown {
  if (depth > MAX_DEPTH || value === null || value === undefined) {
    return value;
  }
  if (Array.isArray(value)) {
    return value.map((v) => redactDeep(v, depth + 1));
  }
  if (typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      out[k] = isSensitiveKey(k) ? maskByKey(k.toLowerCase(), v) : redactDeep(v, depth + 1);
    }
    return out;
  }
  return value;
}
