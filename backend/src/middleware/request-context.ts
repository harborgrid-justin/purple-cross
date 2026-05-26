import { Request, Response, NextFunction } from 'express';
import { runWithContext } from '../context/request-context';

/**
 * Opens an AsyncLocalStorage context for the lifetime of the request. Mount
 * after correlation-id middleware so the id is captured; the auth middleware
 * later enriches the same store with the authenticated principal.
 */
export const requestContextMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  runWithContext(
    {
      correlationId: req.correlationId,
      ip: req.ip,
      userAgent: req.get('user-agent') ?? undefined,
    },
    () => next()
  );
};
