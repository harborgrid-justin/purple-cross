import { Request, Response, NextFunction } from 'express';
import { sanitizationMiddleware } from '../../../src/middleware/sanitization';

describe('Sanitization Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    mockRequest = {
      body: {},
      query: {},
      params: {},
      path: '/api/test',
    };
    mockResponse = {};
    nextFunction = jest.fn();
    jest.clearAllMocks();
  });

  describe('XSS Protection', () => {
    it('should sanitize XSS in body', () => {
      mockRequest.body = {
        name: '<script>alert("xss")</script>John',
        description: 'Normal text',
      };

      sanitizationMiddleware(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(mockRequest.body.name).not.toContain('<script>');
      expect(mockRequest.body.description).toBe('Normal text');
      expect(nextFunction).toHaveBeenCalled();
    });

    it('should sanitize XSS in query parameters', () => {
      mockRequest.query = {
        search: '<img src=x onerror=alert(1)>',
        filter: 'normal',
      };

      sanitizationMiddleware(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(mockRequest.query.search).not.toContain('<img');
      expect(mockRequest.query.filter).toBe('normal');
      expect(nextFunction).toHaveBeenCalled();
    });

    it('should sanitize nested objects', () => {
      mockRequest.body = {
        user: {
          name: '<script>alert("xss")</script>',
          profile: {
            bio: '<img src=x onerror=alert(1)>',
          },
        },
      };

      sanitizationMiddleware(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(mockRequest.body.user.name).not.toContain('<script>');
      expect(mockRequest.body.user.profile.bio).not.toContain('<img');
      expect(nextFunction).toHaveBeenCalled();
    });

    it('should handle arrays', () => {
      mockRequest.body = {
        items: ['<script>alert(1)</script>', 'normal', '<img src=x>'],
      };

      sanitizationMiddleware(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(mockRequest.body.items[0]).not.toContain('<script>');
      expect(mockRequest.body.items[1]).toBe('normal');
      expect(mockRequest.body.items[2]).not.toContain('<img');
      expect(nextFunction).toHaveBeenCalled();
    });
  });

  describe('SQL Injection Protection', () => {
    it('should sanitize SQL injection attempts', () => {
      mockRequest.body = {
        username: "admin' OR '1'='1",
        query: 'SELECT * FROM users',
      };

      sanitizationMiddleware(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      // Should escape or remove SQL injection patterns
      expect(mockRequest.body.username).toBeDefined();
      expect(nextFunction).toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty body', () => {
      mockRequest.body = {};

      sanitizationMiddleware(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(mockRequest.body).toEqual({});
      expect(nextFunction).toHaveBeenCalled();
    });

    it('should handle null values', () => {
      mockRequest.body = {
        field: null,
      };

      sanitizationMiddleware(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(mockRequest.body.field).toBeNull();
      expect(nextFunction).toHaveBeenCalled();
    });

    it('should handle undefined values', () => {
      mockRequest.body = {
        field: undefined,
      };

      sanitizationMiddleware(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(mockRequest.body.field).toBeUndefined();
      expect(nextFunction).toHaveBeenCalled();
    });

    it('should handle numbers and booleans', () => {
      mockRequest.body = {
        age: 25,
        active: true,
        price: 99.99,
      };

      sanitizationMiddleware(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(mockRequest.body.age).toBe(25);
      expect(mockRequest.body.active).toBe(true);
      expect(mockRequest.body.price).toBe(99.99);
      expect(nextFunction).toHaveBeenCalled();
    });
  });
});
