import { ReportTemplateService } from '../../../src/services/report-template.service';
import { prisma } from '../../../src/config/database';

// Mock Prisma
jest.mock('../../../src/config/database', () => ({
  prisma: {
    reportTemplate: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

describe('ReportTemplateService', () => {
  let reportTemplateService: ReportTemplateService;

  beforeEach(() => {
    reportTemplateService = new ReportTemplateService();
    jest.clearAllMocks();
  });

  describe('createTemplate', () => {
    it('should create a report template successfully', async () => {
      const templateData = {
        name: 'Monthly Revenue Report',
        description: 'Template for monthly revenue analysis',
        category: 'financial',
        templateContent: '{"columns": ["date", "revenue", "expenses"]}',
        parameters: ['startDate', 'endDate'],
      };

      const expectedResult = {
        id: 'template-123',
        ...templateData,
        isActive: true,
        createdAt: new Date(),
      };

      (prisma.reportTemplate.create as jest.Mock).mockResolvedValue(expectedResult);

      const result = await reportTemplateService.createTemplate(templateData);

      expect(prisma.reportTemplate.create).toHaveBeenCalled();
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getTemplate', () => {
    it('should return a report template when found', async () => {
      const templateId = 'template-123';
      const expectedTemplate = {
        id: templateId,
        name: 'Monthly Revenue Report',
        category: 'financial',
      };

      (prisma.reportTemplate.findUnique as jest.Mock).mockResolvedValue(expectedTemplate);

      const result = await reportTemplateService.getTemplate(templateId);

      expect(result).toEqual(expectedTemplate);
    });

    it('should throw error when report template not found', async () => {
      const templateId = 'non-existent';

      (prisma.reportTemplate.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(reportTemplateService.getTemplate(templateId)).rejects.toThrow(
        'Report template not found'
      );
    });
  });

  describe('listTemplates', () => {
    it('should return paginated report templates', async () => {
      const mockTemplates = [
        { id: 'template-1', name: 'Template 1' },
        { id: 'template-2', name: 'Template 2' },
      ];

      (prisma.reportTemplate.findMany as jest.Mock).mockResolvedValue(mockTemplates);
      (prisma.reportTemplate.count as jest.Mock).mockResolvedValue(2);

      const result = await reportTemplateService.listTemplates({});

      expect(result.items).toEqual(mockTemplates);
      expect(result.total).toBe(2);
    });
  });

  describe('updateTemplate', () => {
    it('should update a report template successfully', async () => {
      const templateId = 'template-123';
      const updateData = { isActive: false };
      const existingTemplate = { id: templateId, isActive: true };
      const updatedTemplate = { ...existingTemplate, ...updateData };

      (prisma.reportTemplate.findUnique as jest.Mock).mockResolvedValue(existingTemplate);
      (prisma.reportTemplate.update as jest.Mock).mockResolvedValue(updatedTemplate);

      const result = await reportTemplateService.updateTemplate(templateId, updateData);

      expect(result.isActive).toBe(false);
    });
  });

  describe('deleteTemplate', () => {
    it('should delete a report template successfully', async () => {
      const templateId = 'template-123';
      const existingTemplate = { id: templateId, name: 'Template' };

      (prisma.reportTemplate.findUnique as jest.Mock).mockResolvedValue(existingTemplate);
      (prisma.reportTemplate.delete as jest.Mock).mockResolvedValue(existingTemplate);

      const result = await reportTemplateService.deleteTemplate(templateId);

      expect(prisma.reportTemplate.delete).toHaveBeenCalledWith({
        where: { id: templateId },
      });
      expect(result).toEqual(existingTemplate);
    });
  });
});
