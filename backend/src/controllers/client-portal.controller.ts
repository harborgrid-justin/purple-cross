import { Request, Response } from 'express';
import clientPortalService from '../services/client-portal.service';
import { HTTP_STATUS } from '../constants';

export class ClientPortalController {
  async create(req: Request, res: Response): Promise<void> {
    const access = await clientPortalService.createPortalAccess(req.body);
    res.status(HTTP_STATUS.CREATED).json({ status: 'success', data: access });
  }

  async getById(req: Request, res: Response): Promise<void> {
    const access = await clientPortalService.getPortalAccess(req.params.id);
    res.status(HTTP_STATUS.OK).json({ status: 'success', data: access });
  }

  async login(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;
    const access = await clientPortalService.validateCredentials(email, password);
    if (!access) {
      res.status(401).json({ status: 'error', message: 'Invalid credentials' });
      return;
    }
    res.status(HTTP_STATUS.OK).json({ status: 'success', data: access });
  }

  async updatePassword(req: Request, res: Response): Promise<void> {
    const { newPassword } = req.body;
    const access = await clientPortalService.updatePassword(req.params.id, newPassword);
    res.status(HTTP_STATUS.OK).json({ status: 'success', data: access });
  }

  async enableTwoFactor(req: Request, res: Response): Promise<void> {
    const { secret } = req.body;
    const access = await clientPortalService.enableTwoFactor(req.params.id, secret);
    res.status(HTTP_STATUS.OK).json({ status: 'success', data: access });
  }

  async disableTwoFactor(req: Request, res: Response): Promise<void> {
    const access = await clientPortalService.disableTwoFactor(req.params.id);
    res.status(HTTP_STATUS.OK).json({ status: 'success', data: access });
  }

  async update(req: Request, res: Response): Promise<void> {
    const access = await clientPortalService.updatePortalAccess(req.params.id, req.body);
    res.status(HTTP_STATUS.OK).json({ status: 'success', data: access });
  }

  async delete(req: Request, res: Response): Promise<void> {
    await clientPortalService.deletePortalAccess(req.params.id);
    res.status(HTTP_STATUS.NO_CONTENT).send();
  }
}

export default new ClientPortalController();
