import { Request, Response, NextFunction } from 'express';
import { timeoutMiddleware } from '../../../src/middleware/timeout';

describe('Timeout Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    mockRequest = {
      method: 'GET',
      path: '/api/test',
      correlationId: 'test-correlation-id',
    } as Partial<Request>;
    mockResponse = {
      on: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      headersSent: false,
    };
    nextFunction = jest.fn();
    jest.clearAllMocks();
  });

  it('should setup timeout handler', () => {
    const middleware = timeoutMiddleware(5000);

    middleware(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(mockResponse.on).toHaveBeenCalledWith('finish', expect.any(Function));
    expect(mockResponse.on).toHaveBeenCalledWith('close', expect.any(Function));
    expect(nextFunction).toHaveBeenCalled();
  });

  it('should use default timeout when not specified', () => {
    const middleware = timeoutMiddleware();

    middleware(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(nextFunction).toHaveBeenCalled();
    expect(mockResponse.on).toHaveBeenCalled();
  });
});
