import { prisma } from '../../src/config/database';
import authService from '../../src/services/auth.service';
import { ROLES, SECURITY } from '../../src/constants';

describe('auth service (integration)', () => {
  const suffix = Date.now();
  let tenantId: string;
  const createdUserIds: string[] = [];

  beforeAll(async () => {
    const tenant = await prisma.tenant.create({
      data: { name: 'Auth IT', slug: `auth-it-${suffix}` },
    });
    tenantId = tenant.id;
  });

  afterAll(async () => {
    await prisma.refreshToken.deleteMany({ where: { userId: { in: createdUserIds } } });
    await prisma.user.deleteMany({ where: { id: { in: createdUserIds } } });
    await prisma.tenant.delete({ where: { id: tenantId } });
  });

  async function makeUser(role: string = ROLES.ADMIN): Promise<{ email: string; password: string }> {
    // lowercase only: the auth service normalises emails to lowercase.
    const email = `auth-${Date.now()}-${Math.random().toString(36).slice(2)}@example.com`;
    const password = 'Sup3rSecret!';
    const user = await authService.createUser({ email, password, role, tenantId });
    createdUserIds.push(user.id);
    return { email, password };
  }

  it('creates a user without exposing the password hash', async () => {
    const { email } = await makeUser();
    const dbUser = await prisma.user.findUnique({ where: { email } });
    expect(dbUser).not.toBeNull();
    expect(dbUser?.passwordHash).not.toEqual('Sup3rSecret!');
    expect(dbUser?.tenantId).toEqual(tenantId);
  });

  it('logs in with valid credentials and returns tokens + tenant', async () => {
    const { email, password } = await makeUser();
    const result = await authService.login({ email, password });
    expect(result.accessToken).toBeTruthy();
    expect(result.refreshToken).toBeTruthy();
    expect(result.user.tenantId).toEqual(tenantId);
    expect((result.user as unknown as { passwordHash?: string }).passwordHash).toBeUndefined();
  });

  it('rejects an invalid password', async () => {
    const { email } = await makeUser();
    await expect(authService.login({ email, password: 'wrong' })).rejects.toMatchObject({
      statusCode: 401,
    });
  });

  it('rotates refresh tokens and detects reuse of a revoked token', async () => {
    const { email, password } = await makeUser();
    const first = await authService.login({ email, password });

    const rotated = await authService.refresh({ refreshToken: first.refreshToken });
    expect(rotated.refreshToken).not.toEqual(first.refreshToken);

    // Reusing the original (now revoked) refresh token must fail...
    await expect(
      authService.refresh({ refreshToken: first.refreshToken })
    ).rejects.toMatchObject({ statusCode: 401 });

    // ...and reuse detection revokes the whole chain, so the rotated one too.
    await expect(
      authService.refresh({ refreshToken: rotated.refreshToken })
    ).rejects.toMatchObject({ statusCode: 401 });
  });

  it('returns the current user from getMe', async () => {
    const { email, password } = await makeUser();
    const { user } = await authService.login({ email, password });
    const me = await authService.getMe(user.id);
    expect(me.email).toEqual(email);
    expect(me.role).toEqual(ROLES.ADMIN);
  });

  it('locks the account after too many failed attempts', async () => {
    const { email, password } = await makeUser();
    for (let i = 0; i < SECURITY.MAX_LOGIN_ATTEMPTS; i++) {
      await expect(authService.login({ email, password: 'nope' })).rejects.toBeTruthy();
    }
    // Even a correct password is now rejected while locked.
    await expect(authService.login({ email, password })).rejects.toMatchObject({
      statusCode: 403,
    });
  });
});
