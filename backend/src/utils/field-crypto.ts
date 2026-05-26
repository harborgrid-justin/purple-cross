import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'crypto';
import env from '../config/env';

/**
 * AES-256-GCM field-level encryption for sensitive columns at rest. The 32-byte
 * key is derived from FIELD_ENCRYPTION_KEY via SHA-256 (so any sufficiently
 * long secret works). Encrypted values are self-describing:
 *   enc:v1:<iv_b64>:<authTag_b64>:<ciphertext_b64>
 * Decryption of a non-prefixed value is a no-op, so pre-existing plaintext and
 * partially-migrated columns remain readable.
 */
const PREFIX = 'enc:v1:';
const key = createHash('sha256').update(env.fieldEncryptionKey).digest();

export function isEncrypted(value: string): boolean {
  return value.startsWith(PREFIX);
}

export function encryptField(plaintext: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', key, iv);
  const ciphertext = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return (
    PREFIX +
    [iv.toString('base64'), authTag.toString('base64'), ciphertext.toString('base64')].join(':')
  );
}

export function decryptField(value: string): string {
  if (!isEncrypted(value)) {
    return value;
  }
  const [ivB64, tagB64, dataB64] = value.slice(PREFIX.length).split(':');
  const iv = Buffer.from(ivB64, 'base64');
  const authTag = Buffer.from(tagB64, 'base64');
  const ciphertext = Buffer.from(dataB64, 'base64');
  const decipher = createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(authTag);
  return Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString('utf8');
}
