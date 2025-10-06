import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export class ClientPortalService {
  async createPortalAccess(data: { clientId: string; email: string; password: string }) {
    const passwordHash = await bcrypt.hash(data.password, 10);

    return prisma.clientPortalAccess.create({
      data: {
        clientId: data.clientId,
        email: data.email,
        passwordHash,
        status: 'active',
      },
    });
  }

  async getPortalAccess(id: string) {
    return prisma.clientPortalAccess.findUnique({
      where: { id },
      select: {
        id: true,
        clientId: true,
        email: true,
        twoFactorEnabled: true,
        lastLoginAt: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async getPortalAccessByEmail(email: string) {
    return prisma.clientPortalAccess.findUnique({
      where: { email },
    });
  }

  async validateCredentials(email: string, password: string) {
    const access = await this.getPortalAccessByEmail(email);
    if (!access) return null;

    const isValid = await bcrypt.compare(password, access.passwordHash);
    if (!isValid) {
      await this.incrementLoginAttempts(access.id);
      return null;
    }

    await this.resetLoginAttempts(access.id);
    await this.updateLastLogin(access.id);

    return access;
  }

  async updatePassword(id: string, newPassword: string) {
    const passwordHash = await bcrypt.hash(newPassword, 10);

    return prisma.clientPortalAccess.update({
      where: { id },
      data: { passwordHash },
    });
  }

  async enableTwoFactor(id: string, secret: string) {
    return prisma.clientPortalAccess.update({
      where: { id },
      data: {
        twoFactorEnabled: true,
        twoFactorSecret: secret,
      },
    });
  }

  async disableTwoFactor(id: string) {
    return prisma.clientPortalAccess.update({
      where: { id },
      data: {
        twoFactorEnabled: false,
        twoFactorSecret: null,
      },
    });
  }

  async incrementLoginAttempts(id: string) {
    const access = await prisma.clientPortalAccess.findUnique({
      where: { id },
    });

    if (!access) return null;

    const loginAttempts = access.loginAttempts + 1;
    const updateData: any = { loginAttempts };

    if (loginAttempts >= 5) {
      updateData.lockedUntil = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
    }

    return prisma.clientPortalAccess.update({
      where: { id },
      data: updateData,
    });
  }

  async resetLoginAttempts(id: string) {
    return prisma.clientPortalAccess.update({
      where: { id },
      data: {
        loginAttempts: 0,
        lockedUntil: null,
      },
    });
  }

  async updateLastLogin(id: string) {
    return prisma.clientPortalAccess.update({
      where: { id },
      data: {
        lastLoginAt: new Date(),
      },
    });
  }

  async updatePortalAccess(id: string, data: any) {
    return prisma.clientPortalAccess.update({ where: { id }, data });
  }

  async deletePortalAccess(id: string) {
    return prisma.clientPortalAccess.delete({
      where: { id },
    });
  }
}

export default new ClientPortalService();
