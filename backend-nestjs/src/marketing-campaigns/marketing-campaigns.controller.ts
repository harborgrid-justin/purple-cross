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
    const campaign = await this.marketingCampaignsService.createCampaign(body);
    return campaign ;
  }

  @Get(':id')
  async getById(@Param('id', ParseUUIDPipe) id: string) {
    const campaign = await this.marketingCampaignsService.getCampaign(id);
    return campaign ;
  }

  @Get()
  async getAll(@Query() query: any) {
    const { status, campaignType, page, limit } = query;
    const result = await this.marketingCampaignsService.listCampaigns({
      status: status as string,
      campaignType: campaignType as string,
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
    });
    return result ;
  }

  @Get(':id/launch')
  async launch(@Param('id', ParseUUIDPipe) id: string, @Body() body: any) {
    const campaign = await this.marketingCampaignsService.launchCampaign(id);
    return campaign ;
  }

  @Put()
  async updateMetrics(@Param('id', ParseUUIDPipe) id: string, @Body() body: any) {
    const { metrics } = body;
    const campaign = await this.marketingCampaignsService.updateCampaignMetrics(id, metrics);
    return campaign ;
  }

  @Get(':id/complete')
  async complete(@Param('id', ParseUUIDPipe) id: string, @Body() body: any) {
    const campaign = await this.marketingCampaignsService.completeCampaign(id);
    return campaign ;
  }

  @Put(':id')
  async update(@Param('id', ParseUUIDPipe) id: string, @Body(ValidationPipe) body: any) {
    const campaign = await this.marketingCampaignsService.updateCampaign(id, body);
    return campaign ;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    await this.marketingCampaignsService.deleteCampaign(id);
    return;
  }
}