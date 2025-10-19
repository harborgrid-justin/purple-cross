import { ClientPortalService } from '../../../src/services/client-portal.service';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

// Mock Prisma Client
jest.mock('@prisma/client', () => {
  const mockPrismaClient = {
    clientPortalAccess: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  };
  return {
    PrismaClient: jest.fn(() => mockPrismaClient),
  };
});

// Mock bcrypt
jest.mock('bcrypt');

describe('ClientPortalService', () => {
  let clientPortalService: ClientPortalService;
  let mockPrisma: any;

  beforeEach(() => {
    clientPortalService = new ClientPortalService();
    const prismaInstance = new PrismaClient();
    mockPrisma = prismaInstance;
    jest.clearAllMocks();
  });

  describe('createPortalAccess', () => {
    it('should create portal access successfully', async () => {
      const accessData = {
        clientId: 'client-123',
        email: 'test@example.com',
        password: 'password123',
      };

      const hashedPassword = 'hashed_password';
      const expectedResult = {
        id: 'access-123',
        clientId: accessData.clientId,
        email: accessData.email,
        passwordHash: hashedPassword,
        status: 'active',
      };

      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      mockPrisma.clientPortalAccess.create.mockResolvedValue(expectedResult);

      const result = await clientPortalService.createPortalAccess(accessData);

      expect(bcrypt.hash).toHaveBeenCalledWith(accessData.password, 10);
      expect(mockPrisma.clientPortalAccess.create).toHaveBeenCalled();
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getPortalAccess', () => {
    it('should return portal access when found', async () => {
      const accessId = 'access-123';
      const expectedAccess = {
        id: accessId,
        clientId: 'client-123',
        email: 'test@example.com',
        twoFactorEnabled: false,
        lastLoginAt: new Date(),
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.clientPortalAccess.findUnique.mockResolvedValue(expectedAccess);

      const result = await clientPortalService.getPortalAccess(accessId);

      expect(result).toEqual(expectedAccess);
    });
  });

  describe('getPortalAccessByEmail', () => {
    it('should return portal access by email', async () => {
      const email = 'test@example.com';
      const expectedAccess = {
        id: 'access-123',
        email,
        passwordHash: 'hashed_password',
      };

      mockPrisma.clientPortalAccess.findUnique.mockResolvedValue(expectedAccess);

      const result = await clientPortalService.getPortalAccessByEmail(email);

      expect(mockPrisma.clientPortalAccess.findUnique).toHaveBeenCalledWith({
        where: { email },
      });
      expect(result).toEqual(expectedAccess);
    });
  });

  describe('updatePassword', () => {
    it('should update password successfully', async () => {
      const accessId = 'access-123';
      const newPassword = 'newPassword123';
      const hashedPassword = 'new_hashed_password';
      const updatedAccess = {
        id: accessId,
        passwordHash: hashedPassword,
      };

      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      mockPrisma.clientPortalAccess.update.mockResolvedValue(updatedAccess);

      const result = await clientPortalService.updatePassword(accessId, newPassword);

      expect(bcrypt.hash).toHaveBeenCalledWith(newPassword, 10);
      expect(mockPrisma.clientPortalAccess.update).toHaveBeenCalledWith({
        where: { id: accessId },
        data: { passwordHash: hashedPassword },
      });
      expect(result).toEqual(updatedAccess);
    });
  });
});
