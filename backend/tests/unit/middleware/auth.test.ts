import { Response, NextFunction } from 'express';
import { authenticate, authorize, AuthRequest } from '../../../src/middleware/auth';
import { AppError } from '../../../src/middleware/error-handler';
import jwt from 'jsonwebtoken';

jest.mock('jsonwebtoken');
jest.mock('../../../src/config/env', () => {
  const mockEnv = {
    jwtSecret: 'test-secret',
  };
  return {
    __esModule: true,
    default: mockEnv,
  };
});

describe('Auth Middleware', () => {
  let mockRequest: Partial<AuthRequest>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    mockRequest = {
      headers: {},
    };
    mockResponse = {};
    nextFunction = jest.fn();
    jest.clearAllMocks();
  });

  describe('authenticate', () => {
    it('should authenticate valid token', () => {
      const mockDecoded = {
        id: 'user-1',
        email: 'test@example.com',
        role: 'admin',
      };

      mockRequest.headers = {
        authorization: 'Bearer valid-token',
      };

      (jwt.verify as jest.Mock).mockReturnValue(mockDecoded);

      authenticate(mockRequest as AuthRequest, mockResponse as Response, nextFunction);

      expect(jwt.verify).toHaveBeenCalledWith('valid-token', 'test-secret');
      expect(mockRequest.user).toEqual(mockDecoded);
      expect(nextFunction).toHaveBeenCalled();
    });

    it('should throw error when no token provided', () => {
      mockRequest.headers = {};

      try {
        authenticate(mockRequest as AuthRequest, mockResponse as Response, nextFunction);
        fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect((error as AppError).message).toContain('No token provided');
      }

      expect(nextFunction).not.toHaveBeenCalled();
    });

    it('should throw error when authorization header is malformed', () => {
      mockRequest.headers = {
        authorization: 'InvalidFormat token',
      };

      try {
        authenticate(mockRequest as AuthRequest, mockResponse as Response, nextFunction);
        fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect((error as AppError).message).toContain('No token provided');
      }

      expect(nextFunction).not.toHaveBeenCalled();
    });

    it('should throw error for invalid token', () => {
      mockRequest.headers = {
        authorization: 'Bearer invalid-token',
      };

      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new jwt.JsonWebTokenError('invalid token');
      });

      try {
        authenticate(mockRequest as AuthRequest, mockResponse as Response, nextFunction);
        fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect((error as AppError).message).toContain('Invalid token');
      }
    });

    it('should throw error for expired token', () => {
      mockRequest.headers = {
        authorization: 'Bearer expired-token',
      };

      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new jwt.TokenExpiredError('token expired', new Date());
      });

      try {
        authenticate(mockRequest as AuthRequest, mockResponse as Response, nextFunction);
        fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect((error as AppError).message).toContain('Token expired');
      }
    });
  });

  describe('authorize', () => {
    it('should authorize user with correct role', () => {
      mockRequest.user = {
        id: 'user-1',
        email: 'test@example.com',
        role: 'admin',
      };

      const authorizeMiddleware = authorize('admin', 'superadmin');

      authorizeMiddleware(mockRequest as AuthRequest, mockResponse as Response, nextFunction);

      expect(nextFunction).toHaveBeenCalled();
    });

    it('should reject user without user object', () => {
      mockRequest.user = undefined;

      const authorizeMiddleware = authorize('admin');

      try {
        authorizeMiddleware(mockRequest as AuthRequest, mockResponse as Response, nextFunction);
        fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect((error as AppError).message).toContain('Unauthorized');
      }

      expect(nextFunction).not.toHaveBeenCalled();
    });

    it('should reject user with incorrect role', () => {
      mockRequest.user = {
        id: 'user-1',
        email: 'test@example.com',
        role: 'user',
      };

      const authorizeMiddleware = authorize('admin');

      try {
        authorizeMiddleware(mockRequest as AuthRequest, mockResponse as Response, nextFunction);
        fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect((error as AppError).message).toContain('Forbidden');
      }

      expect(nextFunction).not.toHaveBeenCalled();
    });

    it('should allow multiple roles', () => {
      mockRequest.user = {
        id: 'user-1',
        email: 'test@example.com',
        role: 'veterinarian',
      };

      const authorizeMiddleware = authorize('admin', 'veterinarian', 'nurse');

      authorizeMiddleware(mockRequest as AuthRequest, mockResponse as Response, nextFunction);

      expect(nextFunction).toHaveBeenCalled();
    });
  });
});
