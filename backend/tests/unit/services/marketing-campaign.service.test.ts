import { MarketingCampaignService } from '../../../src/services/marketing-campaign.service';
import { prisma } from '../../../src/config/database';

// Mock Prisma
jest.mock('../../../src/config/database', () => ({
  prisma: {
    marketingCampaign: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      update: jest.fn(),
    },
  },
}));

describe('MarketingCampaignService', () => {
  let marketingCampaignService: MarketingCampaignService;

  beforeEach(() => {
    marketingCampaignService = new MarketingCampaignService();
    jest.clearAllMocks();
  });

  describe('createCampaign', () => {
    it('should create a marketing campaign successfully', async () => {
      const campaignData = {
        name: 'Spring Vaccination Campaign',
        type: 'email',
        startDate: new Date('2024-03-01'),
        endDate: new Date('2024-03-31'),
        targetAudience: 'all-clients',
        message: 'Time for spring vaccinations!',
      };

      const expectedResult = {
        id: 'campaign-123',
        ...campaignData,
        status: 'draft',
        createdAt: new Date(),
      };

      (prisma.marketingCampaign.create as jest.Mock).mockResolvedValue(expectedResult);

      const result = await marketingCampaignService.createCampaign(campaignData);

      expect(prisma.marketingCampaign.create).toHaveBeenCalled();
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getCampaign', () => {
    it('should return a campaign when found', async () => {
      const campaignId = 'campaign-123';
      const expectedCampaign = {
        id: campaignId,
        name: 'Spring Vaccination Campaign',
        type: 'email',
      };

      (prisma.marketingCampaign.findUnique as jest.Mock).mockResolvedValue(expectedCampaign);

      const result = await marketingCampaignService.getCampaign(campaignId);

      expect(result).toEqual(expectedCampaign);
    });

    it('should throw error when campaign not found', async () => {
      const campaignId = 'non-existent';

      (prisma.marketingCampaign.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(marketingCampaignService.getCampaign(campaignId)).rejects.toThrow(
        'Marketing campaign not found'
      );
    });
  });

  describe('listCampaigns', () => {
    it('should return paginated campaigns', async () => {
      const mockCampaigns = [
        { id: 'campaign-1', name: 'Campaign 1' },
        { id: 'campaign-2', name: 'Campaign 2' },
      ];

      (prisma.marketingCampaign.findMany as jest.Mock).mockResolvedValue(mockCampaigns);
      (prisma.marketingCampaign.count as jest.Mock).mockResolvedValue(2);

      const result = await marketingCampaignService.listCampaigns({});

      expect(result.data).toEqual(mockCampaigns);
      expect(result.pagination.total).toBe(2);
    });
  });

  describe('updateCampaign', () => {
    it('should update a campaign successfully', async () => {
      const campaignId = 'campaign-123';
      const updateData = { status: 'active' };
      const existingCampaign = { id: campaignId, status: 'draft' };
      const updatedCampaign = { ...existingCampaign, ...updateData };

      (prisma.marketingCampaign.findUnique as jest.Mock).mockResolvedValue(existingCampaign);
      (prisma.marketingCampaign.update as jest.Mock).mockResolvedValue(updatedCampaign);

      const result = await marketingCampaignService.updateCampaign(campaignId, updateData);

      expect(result.status).toBe('active');
    });
  });
});
