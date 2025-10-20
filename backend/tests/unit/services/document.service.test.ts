import { DocumentService } from '../../../src/services/document.service';
import { prisma } from '../../../src/config/database';

// Mock Prisma
jest.mock('../../../src/config/database', () => ({
  prisma: {
    document: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

describe('DocumentService', () => {
  let documentService: DocumentService;

  beforeEach(() => {
    documentService = new DocumentService();
    jest.clearAllMocks();
  });

  describe('createDocument', () => {
    it('should create a document successfully', async () => {
      const documentData = {
        fileName: 'test-document.pdf',
        fileType: 'application/pdf',
        fileSize: 1024,
        filePath: '/uploads/test-document.pdf',
        entityType: 'patient',
        entityId: 'patient-123',
        category: 'medical-record',
      };

      const expectedResult = {
        id: 'document-123',
        ...documentData,
        createdAt: new Date(),
      };

      (prisma.document.create as jest.Mock).mockResolvedValue(expectedResult);

      const result = await documentService.createDocument(documentData);

      expect(prisma.document.create).toHaveBeenCalledWith({
        data: documentData,
      });
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getDocumentById', () => {
    it('should return a document when found', async () => {
      const documentId = 'document-123';
      const expectedDocument = {
        id: documentId,
        fileName: 'test-document.pdf',
        fileType: 'application/pdf',
      };

      (prisma.document.findUnique as jest.Mock).mockResolvedValue(expectedDocument);

      const result = await documentService.getDocumentById(documentId);

      expect(result).toEqual(expectedDocument);
    });

    it('should throw error when document not found', async () => {
      const documentId = 'non-existent';

      (prisma.document.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(documentService.getDocumentById(documentId)).rejects.toThrow(
        'Document not found'
      );
    });
  });

  describe('getAllDocuments', () => {
    it('should return all documents with pagination', async () => {
      const mockDocuments = [
        { id: 'document-1', fileName: 'doc1.pdf' },
        { id: 'document-2', fileName: 'doc2.pdf' },
      ];

      (prisma.document.findMany as jest.Mock).mockResolvedValue(mockDocuments);
      (prisma.document.count as jest.Mock).mockResolvedValue(2);

      const result = await documentService.getAllDocuments({});

      expect(result.data).toEqual(mockDocuments);
      expect(result.pagination.total).toBe(2);
    });

    it('should filter documents by entityType', async () => {
      const entityType = 'patient';
      const mockDocuments = [{ id: 'document-1', entityType }];

      (prisma.document.findMany as jest.Mock).mockResolvedValue(mockDocuments);
      (prisma.document.count as jest.Mock).mockResolvedValue(1);

      await documentService.getAllDocuments({ entityType });

      expect(prisma.document.findMany).toHaveBeenCalled();
    });
  });

  describe('updateDocument', () => {
    it('should update a document successfully', async () => {
      const documentId = 'document-123';
      const updateData = { category: 'test-result' };
      const existingDocument = { id: documentId, category: 'medical-record' };
      const updatedDocument = { ...existingDocument, ...updateData };

      (prisma.document.findUnique as jest.Mock).mockResolvedValue(existingDocument);
      (prisma.document.update as jest.Mock).mockResolvedValue(updatedDocument);

      const result = await documentService.updateDocument(documentId, updateData);

      expect(result.category).toBe('test-result');
    });
  });

  describe('deleteDocument', () => {
    it('should delete a document successfully', async () => {
      const documentId = 'document-123';
      const existingDocument = { id: documentId, fileName: 'test.pdf' };

      (prisma.document.findUnique as jest.Mock).mockResolvedValue(existingDocument);
      (prisma.document.delete as jest.Mock).mockResolvedValue(existingDocument);

      const result = await documentService.deleteDocument(documentId);

      expect(prisma.document.delete).toHaveBeenCalledWith({
        where: { id: documentId },
      });
      expect(result).toEqual(existingDocument);
    });
  });
});
