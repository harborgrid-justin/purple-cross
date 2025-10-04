import { ClientService } from '../../../src/services/client.service';
import { prisma } from '../../../src/config/database';

// Mock Prisma
jest.mock('../../../src/config/database', () => ({
  prisma: {
    client: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      update: jest.fn(),
    },
  },
}));

describe('ClientService', () => {
  let clientService: ClientService;

  beforeEach(() => {
    clientService = new ClientService();
    jest.clearAllMocks();
  });

  describe('createClient', () => {
    it('should create a client successfully', async () => {
      const clientData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+1-555-0123',
      };

      const expectedResult = {
        id: 'client-123',
        ...clientData,
        patients: [],
      };

      (prisma.client.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.client.create as jest.Mock).mockResolvedValue(expectedResult);

      const result = await clientService.createClient(clientData);

      expect(prisma.client.findUnique).toHaveBeenCalledWith({
        where: { email: clientData.email },
      });
      expect(prisma.client.create).toHaveBeenCalledWith({
        data: clientData,
        include: { patients: true },
      });
      expect(result).toEqual(expectedResult);
    });

    it('should throw error when email already exists', async () => {
      const clientData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'existing@example.com',
        phone: '+1-555-0123',
      };

      (prisma.client.findUnique as jest.Mock).mockResolvedValue({
        id: 'existing-client',
        email: clientData.email,
      });

      await expect(clientService.createClient(clientData)).rejects.toThrow(
        'Client with this email already exists'
      );
    });
  });

  describe('getClientById', () => {
    it('should return a client when found', async () => {
      const clientId = 'client-123';
      const expectedClient = {
        id: clientId,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        patients: [],
        appointments: [],
        invoices: [],
      };

      (prisma.client.findUnique as jest.Mock).mockResolvedValue(expectedClient);

      const result = await clientService.getClientById(clientId);

      expect(prisma.client.findUnique).toHaveBeenCalledWith({
        where: { id: clientId },
        include: {
          patients: { orderBy: { name: 'asc' } },
          appointments: { orderBy: { startTime: 'desc' }, take: 10 },
          invoices: { orderBy: { createdAt: 'desc' }, take: 10 },
        },
      });
      expect(result).toEqual(expectedClient);
    });

    it('should throw error when client not found', async () => {
      const clientId = 'non-existent';

      (prisma.client.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(clientService.getClientById(clientId)).rejects.toThrow('Client not found');
    });
  });

  describe('getAllClients', () => {
    it('should return paginated clients with default options', async () => {
      const mockClients = [
        { id: 'client-1', firstName: 'John', lastName: 'Doe', patients: [] },
        { id: 'client-2', firstName: 'Jane', lastName: 'Smith', patients: [] },
      ];

      (prisma.client.findMany as jest.Mock).mockResolvedValue(mockClients);
      (prisma.client.count as jest.Mock).mockResolvedValue(2);

      const result = await clientService.getAllClients({});

      expect(result.data).toEqual(mockClients);
      expect(result.pagination).toEqual({
        page: 1,
        limit: 20,
        total: 2,
        totalPages: 1,
      });
    });

    it('should filter clients by search term', async () => {
      const searchTerm = 'John';
      const mockClients = [{ id: 'client-1', firstName: 'John', lastName: 'Doe' }];

      (prisma.client.findMany as jest.Mock).mockResolvedValue(mockClients);
      (prisma.client.count as jest.Mock).mockResolvedValue(1);

      await clientService.getAllClients({ search: searchTerm });

      expect(prisma.client.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            OR: expect.arrayContaining([
              { firstName: { contains: searchTerm, mode: 'insensitive' } },
            ]),
          }),
        })
      );
    });

    it('should filter clients by status', async () => {
      const status = 'active';
      const mockClients = [{ id: 'client-1', status: 'active' }];

      (prisma.client.findMany as jest.Mock).mockResolvedValue(mockClients);
      (prisma.client.count as jest.Mock).mockResolvedValue(1);

      await clientService.getAllClients({ status });

      expect(prisma.client.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ status }),
        })
      );
    });
  });

  describe('updateClient', () => {
    it('should update a client successfully', async () => {
      const clientId = 'client-123';
      const updateData = { firstName: 'UpdatedName' };
      const existingClient = { id: clientId, firstName: 'John' };
      const updatedClient = { ...existingClient, ...updateData };

      (prisma.client.findUnique as jest.Mock).mockResolvedValue(existingClient);
      (prisma.client.update as jest.Mock).mockResolvedValue(updatedClient);

      const result = await clientService.updateClient(clientId, updateData);

      expect(prisma.client.update).toHaveBeenCalledWith({
        where: { id: clientId },
        data: updateData,
        include: { patients: true },
      });
      expect(result).toEqual(updatedClient);
    });

    it('should throw error when updating non-existent client', async () => {
      const clientId = 'non-existent';

      (prisma.client.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(clientService.updateClient(clientId, {})).rejects.toThrow('Client not found');
    });
  });

  describe('deleteClient', () => {
    it('should soft delete a client by setting status to inactive', async () => {
      const clientId = 'client-123';
      const existingClient = { id: clientId, status: 'active' };
      const deletedClient = { ...existingClient, status: 'inactive' };

      (prisma.client.findUnique as jest.Mock).mockResolvedValue(existingClient);
      (prisma.client.update as jest.Mock).mockResolvedValue(deletedClient);

      const result = await clientService.deleteClient(clientId);

      expect(prisma.client.update).toHaveBeenCalledWith({
        where: { id: clientId },
        data: { status: 'inactive' },
      });
      expect(result.status).toBe('inactive');
    });

    it('should throw error when deleting non-existent client', async () => {
      const clientId = 'non-existent';

      (prisma.client.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(clientService.deleteClient(clientId)).rejects.toThrow('Client not found');
    });
  });
});
