import { Request, Response } from 'express';
import marketingCampaignService from '../services/marketing-campaign.service';
import { HTTP_STATUS } from '../constants';

export class MarketingCampaignController {
  async create(req: Request, res: Response): Promise<void> {
    const campaign = await marketingCampaignService.createCampaign(req.body);
    res.status(HTTP_STATUS.CREATED).json({ status: 'success', data: campaign });
  }

  async getById(req: Request, res: Response): Promise<void> {
    const campaign = await marketingCampaignService.getCampaign(req.params.id);
    res.status(HTTP_STATUS.OK).json({ status: 'success', data: campaign });
  }

  async getAll(req: Request, res: Response): Promise<void> {
    const { status, campaignType, page, limit } = req.query;
    const result = await marketingCampaignService.listCampaigns({
      status: status as string,
      campaignType: campaignType as string,
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
    });
    res.status(HTTP_STATUS.OK).json({ status: 'success', ...result });
  }

  async launch(req: Request, res: Response): Promise<void> {
    const campaign = await marketingCampaignService.launchCampaign(req.params.id);
    res.status(HTTP_STATUS.OK).json({ status: 'success', data: campaign });
  }

  async updateMetrics(req: Request, res: Response): Promise<void> {
    const { metrics } = req.body;
    const campaign = await marketingCampaignService.updateCampaignMetrics(req.params.id, metrics);
    res.status(HTTP_STATUS.OK).json({ status: 'success', data: campaign });
  }

  async complete(req: Request, res: Response): Promise<void> {
    const campaign = await marketingCampaignService.completeCampaign(req.params.id);
    res.status(HTTP_STATUS.OK).json({ status: 'success', data: campaign });
  }

  async update(req: Request, res: Response): Promise<void> {
    const campaign = await marketingCampaignService.updateCampaign(req.params.id, req.body);
    res.status(HTTP_STATUS.OK).json({ status: 'success', data: campaign });
  }

  async delete(req: Request, res: Response): Promise<void> {
    await marketingCampaignService.deleteCampaign(req.params.id);
    res.status(HTTP_STATUS.NO_CONTENT).send();
  }
}

export default new MarketingCampaignController();
