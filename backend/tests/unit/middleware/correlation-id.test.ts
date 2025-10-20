import { Request, Response, NextFunction } from 'express';
import { correlationIdMiddleware } from '../../../src/middleware/correlation-id';

describe('Correlation ID Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    mockRequest = {
      headers: {},
      method: 'GET',
      path: '/api/test',
    };
    mockResponse = {
      setHeader: jest.fn(),
    };
    nextFunction = jest.fn();
    jest.clearAllMocks();
  });

  it('should use existing X-Correlation-ID from header', () => {
    const existingId = 'existing-correlation-id';
    mockRequest.headers = {
      'x-correlation-id': existingId,
    };

    correlationIdMiddleware(mockRequest as Request, mockResponse as Response, nextFunction);

    expect((mockRequest as any).correlationId).toBe(existingId);
    expect(mockResponse.setHeader).toHaveBeenCalledWith('X-Correlation-ID', existingId);
    expect(nextFunction).toHaveBeenCalled();
  });

  it('should use existing X-Request-ID from header', () => {
    const existingId = 'existing-request-id';
    mockRequest.headers = {
      'x-request-id': existingId,
    };

    correlationIdMiddleware(mockRequest as Request, mockResponse as Response, nextFunction);

    expect((mockRequest as any).correlationId).toBe(existingId);
    expect(mockResponse.setHeader).toHaveBeenCalledWith('X-Correlation-ID', existingId);
    expect(nextFunction).toHaveBeenCalled();
  });

  it('should generate new UUID if no correlation ID in header', () => {
    mockRequest.headers = {};

    correlationIdMiddleware(mockRequest as Request, mockResponse as Response, nextFunction);

    const correlationId = (mockRequest as any).correlationId;
    expect(correlationId).toBeDefined();
    expect(typeof correlationId).toBe('string');
    expect(correlationId.length).toBeGreaterThan(0);
    expect(mockResponse.setHeader).toHaveBeenCalledWith('X-Correlation-ID', correlationId);
    expect(nextFunction).toHaveBeenCalled();
  });

  it('should prefer X-Correlation-ID over X-Request-ID', () => {
    const correlationId = 'correlation-id';
    const requestId = 'request-id';
    mockRequest.headers = {
      'x-correlation-id': correlationId,
      'x-request-id': requestId,
    };

    correlationIdMiddleware(mockRequest as Request, mockResponse as Response, nextFunction);

    expect((mockRequest as any).correlationId).toBe(correlationId);
    expect(mockResponse.setHeader).toHaveBeenCalledWith('X-Correlation-ID', correlationId);
  });
});
