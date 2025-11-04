import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
  ValidationPipe,
} from '@nestjs/common';
import { MarketingCampaignService } from './marketing-campaigns.service';

@Controller('marketing-campaigns')
export class MarketingCampaignsController {
  constructor(private readonly marketingCampaignsService: MarketingCampaignService) {}
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body(ValidationPipe) body: any) {
    const campaign = await marketingCampaignService.createCampaign(body);
    return campaign ;
  }

  @Get(':id')
  async getById(@Param('id', ParseUUIDPipe) id: string) {
    const campaign = await marketingCampaignService.getCampaign(id);
    return campaign ;
  }

  @Get()
  async getAll(@Query() query: any) {
    const { status, campaignType, page, limit } = query;
    const result = await marketingCampaignService.listCampaigns({
      status: status as string,
      campaignType: campaignType as string,
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
    });
    return result ;
  }

  async launch(req: Request, res: Response) {
    const campaign = await marketingCampaignService.launchCampaign(id);
    return campaign ;
  }

  async updateMetrics(req: Request, res: Response) {
    const { metrics } = body;
    const campaign = await marketingCampaignService.updateCampaignMetrics(id, metrics);
    return campaign ;
  }

  async complete(req: Request, res: Response) {
    const campaign = await marketingCampaignService.completeCampaign(id);
    return campaign ;
  }

  @Put(':id')
  async update(@Param('id', ParseUUIDPipe) id: string, @Body(ValidationPipe) body: any) {
    const campaign = await marketingCampaignService.updateCampaign(id, body);
    return campaign ;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    await marketingCampaignService.deleteCampaign(id);
    return;
  }
}