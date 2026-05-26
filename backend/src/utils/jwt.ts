import jwt, { SignOptions } from 'jsonwebtoken';
import { randomBytes, createHash } from 'crypto';
import env from '../config/env';
import { SECURITY } from '../constants';

export interface AccessTokenPayload {
  id: string;
  email: string;
  role: string;
  staffId?: string;
  tenantId?: string;
}

/**
 * Sign a short-lived access token (HS256). The TTL comes from validated env
 * (`JWT_ACCESS_EXPIRES_IN`).
 */
export function signAccessToken(payload: AccessTokenPayload): string {
  const options: SignOptions = {
    expiresIn: env.jwtAccessExpiresIn as SignOptions['expiresIn'],
  };
  return jwt.sign(payload, env.jwtSecret, options);
}

/**
 * Verify and decode an access token. Throws `jsonwebtoken` errors on
 * invalid/expired tokens (handled by the auth middleware).
 */
export function verifyAccessToken(token: string): AccessTokenPayload {
  return jwt.verify(token, env.jwtSecret) as AccessTokenPayload;
}

/**
 * Generate an opaque refresh token. Only its SHA-256 hash is ever persisted.
 */
export function generateRefreshToken(): string {
  return randomBytes(SECURITY.REFRESH_TOKEN_BYTES).toString('hex');
}

export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

/**
 * Parse a duration string (e.g. "7d", "15m", "24h", "3600s", or a plain number
 * of seconds) into milliseconds. Used to compute refresh-token expiry without
 * pulling in an extra dependency.
 */
export function parseDurationMs(value: string): number {
  const match = /^(\d+)\s*(ms|s|m|h|d)?$/.exec(value.trim());
  if (!match) {
    throw new Error(`Invalid duration: ${value}`);
  }
  const amount = parseInt(match[1], 10);
  const unit = match[2] ?? 's';
  const unitMs: Record<string, number> = {
    ms: 1,
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  };
  return amount * unitMs[unit];
}

/**
 * Absolute expiry `Date` for a newly issued refresh token, derived from
 * `JWT_REFRESH_EXPIRES_IN`.
 */
export function refreshTokenExpiry(): Date {
  return new Date(Date.now() + parseDurationMs(env.jwtRefreshExpiresIn));
}
