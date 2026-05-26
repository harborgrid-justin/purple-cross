import { Request, Response } from 'express';
import authService from '../services/auth.service';
import { AppError } from '../middleware/error-handler';
import { HTTP_STATUS } from '../constants';

function requestMeta(req: Request): { ip?: string; userAgent?: string } {
  return { ip: req.ip, userAgent: req.get('user-agent') ?? undefined };
}

export class AuthController {
  /** Public bootstrap registration (first user only). */
  async register(req: Request, res: Response): Promise<void> {
    const user = await authService.register(req.body);
    res.status(HTTP_STATUS.CREATED).json({ status: 'success', data: user });
  }

  /** Admin-only user provisioning. */
  async createUser(req: Request, res: Response): Promise<void> {
    const user = await authService.createUser(req.body);
    res.status(HTTP_STATUS.CREATED).json({ status: 'success', data: user });
  }

  async login(req: Request, res: Response): Promise<void> {
    const tokens = await authService.login(req.body, requestMeta(req));
    res.status(HTTP_STATUS.OK).json({ status: 'success', data: tokens });
  }

  async refresh(req: Request, res: Response): Promise<void> {
    const tokens = await authService.refresh(req.body, requestMeta(req));
    res.status(HTTP_STATUS.OK).json({ status: 'success', data: tokens });
  }

  async logout(req: Request, res: Response): Promise<void> {
    await authService.logout(req.body);
    res.status(HTTP_STATUS.NO_CONTENT).send();
  }

  async me(req: Request, res: Response): Promise<void> {
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError('Unauthorized', HTTP_STATUS.UNAUTHORIZED);
    }
    const user = await authService.getMe(userId);
    res.status(HTTP_STATUS.OK).json({ status: 'success', data: user });
  }
}

export default new AuthController();
