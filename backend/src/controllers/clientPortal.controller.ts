import { Request, Response } from 'express';
import clientPortalService from '../services/clientPortal.service';

export class ClientPortalController {
  async create(req: Request, res: Response) {
    const access = await clientPortalService.createPortalAccess(req.body);
    res.status(201).json({ status: 'success', data: access });
  }

  async getById(req: Request, res: Response) {
    const access = await clientPortalService.getPortalAccess(req.params.id);
    res.status(200).json({ status: 'success', data: access });
  }

  async login(req: Request, res: Response) {
    const { email, password } = req.body;
    const access = await clientPortalService.validateCredentials(email, password);
    if (!access) {
      return res.status(401).json({ status: 'error', message: 'Invalid credentials' });
    }
    res.status(200).json({ status: 'success', data: access });
  }

  async updatePassword(req: Request, res: Response) {
    const { newPassword } = req.body;
    const access = await clientPortalService.updatePassword(req.params.id, newPassword);
    res.status(200).json({ status: 'success', data: access });
  }

  async enableTwoFactor(req: Request, res: Response) {
    const { secret } = req.body;
    const access = await clientPortalService.enableTwoFactor(req.params.id, secret);
    res.status(200).json({ status: 'success', data: access });
  }

  async disableTwoFactor(req: Request, res: Response) {
    const access = await clientPortalService.disableTwoFactor(req.params.id);
    res.status(200).json({ status: 'success', data: access });
  }

  async delete(req: Request, res: Response) {
    await clientPortalService.deletePortalAccess(req.params.id);
    res.status(204).send();
  }
}

export default new ClientPortalController();
