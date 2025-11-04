import { Module } from '@nestjs/common';
import { MarketingCampaignsController } from './marketing-campaigns.controller';
import { MarketingCampaignService } from './marketing-campaigns.service';

@Module({
  controllers: [MarketingCampaignsController],
  providers: [MarketingCampaignService],
  exports: [MarketingCampaignService],
})
export class MarketingCampaignsModule {}
