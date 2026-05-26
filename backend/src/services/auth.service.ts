import bcrypt from 'bcrypt';
import type { User } from '@prisma/client';
import { prisma } from '../config/database';
import { getContext } from '../context/request-context';
import { AppError } from '../middleware/error-handler';
import {
  HTTP_STATUS,
  ERROR_MESSAGES,
  SECURITY,
  ROLES,
  ALL_ROLES,
  type Role,
} from '../constants';
import {
  signAccessToken,
  generateRefreshToken,
  hashToken,
  refreshTokenExpiry,
} from '../utils/jwt';

export interface SafeUser {
  id: string;
  email: string;
  role: Role;
  status: string;
  firstName: string | null;
  lastName: string | null;
  staffId: string | null;
  tenantId: string | null;
  lastLoginAt: Date | null;
  createdAt: Date;
}

export interface AuthTokens {
  user: SafeUser;
  accessToken: string;
  refreshToken: string;
}

interface RequestMeta {
  ip?: string;
  userAgent?: string;
}

interface CreateUserInput {
  email: string;
  password: string;
  role?: string;
  firstName?: string;
  lastName?: string;
  staffId?: string;
  tenantId?: string;
}

function sanitizeUser(user: User): SafeUser {
  return {
    id: user.id,
    email: user.email,
    role: user.role as Role,
    status: user.status,
    firstName: user.firstName,
    lastName: user.lastName,
    staffId: user.staffId,
    tenantId: user.tenantId,
    lastLoginAt: user.lastLoginAt,
    createdAt: user.createdAt,
  };
}

function assertValidRole(role: string): Role {
  if (!ALL_ROLES.includes(role as Role)) {
    throw new AppError(`Invalid role: ${role}`, HTTP_STATUS.BAD_REQUEST);
  }
  return role as Role;
}

export class AuthService {
  /**
   * Create a user. Used by the bootstrap flow and by admins provisioning logins.
   */
  async createUser(input: CreateUserInput): Promise<SafeUser> {
    const email = input.email.toLowerCase().trim();
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new AppError(ERROR_MESSAGES.ALREADY_EXISTS('User'), HTTP_STATUS.CONFLICT);
    }

    const role = input.role ? assertValidRole(input.role) : ROLES.RECEPTIONIST;
    const passwordHash = await bcrypt.hash(input.password, SECURITY.BCRYPT_ROUNDS);
    // New users join the provisioning admin's tenant unless told otherwise.
    const tenantId = input.tenantId ?? getContext()?.tenantId ?? null;

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        role,
        firstName: input.firstName ?? null,
        lastName: input.lastName ?? null,
        staffId: input.staffId ?? null,
        tenantId,
        passwordChangedAt: new Date(),
      },
    });

    return sanitizeUser(user);
  }

  /** Find or create the bootstrap "Default Clinic" tenant. */
  private async ensureDefaultTenant(): Promise<string> {
    const existing = await prisma.tenant.findUnique({ where: { slug: 'default' } });
    if (existing) {
      return existing.id;
    }
    const created = await prisma.tenant.create({
      data: { name: 'Default Clinic', slug: 'default' },
    });
    return created.id;
  }

  /**
   * Public self-registration is only permitted to bootstrap the very first
   * user (who becomes ADMIN). Afterwards an administrator must create accounts.
   */
  async register(input: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
  }): Promise<SafeUser> {
    const userCount = await prisma.user.count();
    if (userCount > 0) {
      throw new AppError(ERROR_MESSAGES.REGISTRATION_CLOSED, HTTP_STATUS.FORBIDDEN);
    }
    const tenantId = await this.ensureDefaultTenant();
    return this.createUser({ ...input, role: ROLES.ADMIN, tenantId });
  }

  async login(
    input: { email: string; password: string },
    meta: RequestMeta = {}
  ): Promise<AuthTokens> {
    const email = input.email.toLowerCase().trim();
    const user = await prisma.user.findUnique({ where: { email } });

    // Uniform error to avoid leaking which emails exist.
    if (!user) {
      throw new AppError(ERROR_MESSAGES.INVALID_CREDENTIALS, HTTP_STATUS.UNAUTHORIZED);
    }

    if (user.lockedUntil && user.lockedUntil > new Date()) {
      throw new AppError(ERROR_MESSAGES.ACCOUNT_LOCKED, HTTP_STATUS.FORBIDDEN);
    }

    if (user.status !== 'active') {
      throw new AppError('Account is not active', HTTP_STATUS.FORBIDDEN);
    }

    const valid = await bcrypt.compare(input.password, user.passwordHash);
    if (!valid) {
      await this.registerFailedAttempt(user);
      throw new AppError(ERROR_MESSAGES.INVALID_CREDENTIALS, HTTP_STATUS.UNAUTHORIZED);
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { loginAttempts: 0, lockedUntil: null, lastLoginAt: new Date() },
    });

    return this.issueTokens(user, meta);
  }

  async refresh(input: { refreshToken: string }, meta: RequestMeta = {}): Promise<AuthTokens> {
    const tokenHash = hashToken(input.refreshToken);
    const stored = await prisma.refreshToken.findUnique({
      where: { tokenHash },
      include: { user: true },
    });

    if (!stored) {
      throw new AppError(ERROR_MESSAGES.INVALID_REFRESH_TOKEN, HTTP_STATUS.UNAUTHORIZED);
    }

    // Reuse of an already-revoked token => possible theft. Revoke the whole
    // chain for this user as a defensive measure.
    if (stored.revokedAt) {
      await prisma.refreshToken.updateMany({
        where: { userId: stored.userId, revokedAt: null },
        data: { revokedAt: new Date() },
      });
      throw new AppError(ERROR_MESSAGES.INVALID_REFRESH_TOKEN, HTTP_STATUS.UNAUTHORIZED);
    }

    if (stored.expiresAt < new Date()) {
      throw new AppError(ERROR_MESSAGES.INVALID_REFRESH_TOKEN, HTTP_STATUS.UNAUTHORIZED);
    }

    const tokens = await this.issueTokens(stored.user, meta);

    // Rotate: revoke the presented token and link it to its replacement.
    const replacementHash = hashToken(tokens.refreshToken);
    const replacement = await prisma.refreshToken.findUnique({
      where: { tokenHash: replacementHash },
    });
    await prisma.refreshToken.update({
      where: { id: stored.id },
      data: { revokedAt: new Date(), replacedById: replacement?.id ?? null },
    });

    return tokens;
  }

  async logout(input: { refreshToken: string }): Promise<void> {
    const tokenHash = hashToken(input.refreshToken);
    await prisma.refreshToken.updateMany({
      where: { tokenHash, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  async getMe(userId: string): Promise<SafeUser> {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new AppError(ERROR_MESSAGES.NOT_FOUND('User'), HTTP_STATUS.NOT_FOUND);
    }
    return sanitizeUser(user);
  }

  private async issueTokens(user: User, meta: RequestMeta): Promise<AuthTokens> {
    const accessToken = signAccessToken({
      id: user.id,
      email: user.email,
      role: user.role,
      staffId: user.staffId ?? undefined,
      tenantId: user.tenantId ?? undefined,
    });

    const refreshToken = generateRefreshToken();
    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash: hashToken(refreshToken),
        expiresAt: refreshTokenExpiry(),
        createdByIp: meta.ip ?? null,
        userAgent: meta.userAgent ?? null,
      },
    });

    return { user: sanitizeUser(user), accessToken, refreshToken };
  }

  private async registerFailedAttempt(user: User): Promise<void> {
    const attempts = user.loginAttempts + 1;
    const shouldLock = attempts >= SECURITY.MAX_LOGIN_ATTEMPTS;
    await prisma.user.update({
      where: { id: user.id },
      data: {
        loginAttempts: attempts,
        lockedUntil: shouldLock ? new Date(Date.now() + SECURITY.LOCK_DURATION_MS) : null,
      },
    });
  }
}

export default new AuthService();
