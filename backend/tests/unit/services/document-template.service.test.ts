import { DocumentTemplateService } from '../../../src/services/document-template.service';
import { prisma } from '../../../src/config/database';

// Mock Prisma
jest.mock('../../../src/config/database', () => ({
  prisma: {
    documentTemplate: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

describe('DocumentTemplateService', () => {
  let documentTemplateService: DocumentTemplateService;

  beforeEach(() => {
    documentTemplateService = new DocumentTemplateService();
    jest.clearAllMocks();
  });

  describe('createTemplate', () => {
    it('should create a document template successfully', async () => {
      const templateData = {
        name: 'Medical Record Template',
        category: 'medical',
        template: {
          content: '<html><body>{{patientName}}</body></html>',
          variables: ['patientName', 'visitDate'],
        },
        fields: { description: 'Standard medical record format' },
      };

      const expectedResult = {
        id: 'template-123',
        ...templateData,
        status: 'active',
        createdAt: new Date(),
      };

      (prisma.documentTemplate.create as jest.Mock).mockResolvedValue(expectedResult);

      const result = await documentTemplateService.createTemplate(templateData);

      expect(prisma.documentTemplate.create).toHaveBeenCalled();
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getTemplate', () => {
    it('should return a document template when found', async () => {
      const templateId = 'template-123';
      const expectedTemplate = {
        id: templateId,
        name: 'Medical Record Template',
        category: 'medical',
      };

      (prisma.documentTemplate.findUnique as jest.Mock).mockResolvedValue(expectedTemplate);

      const result = await documentTemplateService.getTemplate(templateId);

      expect(result).toEqual(expectedTemplate);
    });

    it('should throw error when document template not found', async () => {
      const templateId = 'non-existent';

      (prisma.documentTemplate.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(documentTemplateService.getTemplate(templateId)).rejects.toThrow(
        'Document template not found'
      );
    });
  });

  describe('listTemplates', () => {
    it('should return paginated document templates', async () => {
      const mockTemplates = [
        { id: 'template-1', name: 'Template 1' },
        { id: 'template-2', name: 'Template 2' },
      ];

      (prisma.documentTemplate.findMany as jest.Mock).mockResolvedValue(mockTemplates);
      (prisma.documentTemplate.count as jest.Mock).mockResolvedValue(2);

      const result = await documentTemplateService.listTemplates({});

      expect(result.items).toEqual(mockTemplates);
      expect(result.total).toBe(2);
    });
  });

  describe('updateTemplate', () => {
    it('should update a document template successfully', async () => {
      const templateId = 'template-123';
      const updateData = { isActive: false };
      const existingTemplate = { id: templateId, isActive: true };
      const updatedTemplate = { ...existingTemplate, ...updateData };

      (prisma.documentTemplate.findUnique as jest.Mock).mockResolvedValue(existingTemplate);
      (prisma.documentTemplate.update as jest.Mock).mockResolvedValue(updatedTemplate);

      const result = await documentTemplateService.updateTemplate(templateId, updateData);

      expect(result.isActive).toBe(false);
    });
  });

  describe('deleteTemplate', () => {
    it('should delete a document template successfully', async () => {
      const templateId = 'template-123';
      const existingTemplate = { id: templateId, name: 'Template' };

      (prisma.documentTemplate.findUnique as jest.Mock).mockResolvedValue(existingTemplate);
      (prisma.documentTemplate.delete as jest.Mock).mockResolvedValue(existingTemplate);

      const result = await documentTemplateService.deleteTemplate(templateId);

      expect(prisma.documentTemplate.delete).toHaveBeenCalledWith({
        where: { id: templateId },
      });
      expect(result).toEqual(existingTemplate);
    });
  });
});
