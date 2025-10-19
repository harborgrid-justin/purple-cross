import { StaffService } from '../../../src/services/staff.service';
import { prisma } from '../../../src/config/database';

// Mock Prisma
jest.mock('../../../src/config/database', () => ({
  prisma: {
    staff: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      update: jest.fn(),
    },
  },
}));

describe('StaffService', () => {
  let staffService: StaffService;

  beforeEach(() => {
    staffService = new StaffService();
    jest.clearAllMocks();
  });

  describe('createStaff', () => {
    it('should create a staff member successfully', async () => {
      const staffData = {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@purplecross.com',
        role: 'veterinarian',
        licenseNumber: 'VET-12345',
        hireDate: new Date('2024-01-01'),
      };

      const expectedResult = {
        id: 'staff-123',
        ...staffData,
      };

      (prisma.staff.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.staff.create as jest.Mock).mockResolvedValue(expectedResult);

      const result = await staffService.createStaff(staffData);

      expect(result).toEqual(expectedResult);
    });

    it('should throw error when email already exists', async () => {
      const staffData = {
        email: 'existing@purplecross.com',
      };

      (prisma.staff.findUnique as jest.Mock).mockResolvedValue({ id: 'existing' });

      await expect(staffService.createStaff(staffData)).rejects.toThrow(
        'Staff with this email already exists'
      );
    });
  });

  describe('getStaffById', () => {
    it('should return a staff member when found', async () => {
      const staffId = 'staff-123';
      const expectedStaff = {
        id: staffId,
        firstName: 'Jane',
        lastName: 'Smith',
        role: 'veterinarian',
      };

      (prisma.staff.findUnique as jest.Mock).mockResolvedValue(expectedStaff);

      const result = await staffService.getStaffById(staffId);

      expect(result).toEqual(expectedStaff);
    });

    it('should throw error when staff member not found', async () => {
      const staffId = 'non-existent';

      (prisma.staff.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(staffService.getStaffById(staffId)).rejects.toThrow('Staff member not found');
    });
  });

  describe('getAllStaff', () => {
    it('should return all staff members with pagination', async () => {
      const mockStaff = [
        { id: 'staff-1', firstName: 'Jane', role: 'veterinarian' },
        { id: 'staff-2', firstName: 'John', role: 'technician' },
      ];

      (prisma.staff.findMany as jest.Mock).mockResolvedValue(mockStaff);
      (prisma.staff.count as jest.Mock).mockResolvedValue(2);

      const result = await staffService.getAllStaff({});

      expect(result.data).toEqual(mockStaff);
      expect(result.pagination.total).toBe(2);
    });

    it('should filter staff by role', async () => {
      const role = 'veterinarian';
      const mockStaff = [{ id: 'staff-1', role }];

      (prisma.staff.findMany as jest.Mock).mockResolvedValue(mockStaff);
      (prisma.staff.count as jest.Mock).mockResolvedValue(1);

      await staffService.getAllStaff({ role });

      expect(prisma.staff.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ role }),
        })
      );
    });

    it('should filter staff by status', async () => {
      const status = 'active';
      const mockStaff = [{ id: 'staff-1', status }];

      (prisma.staff.findMany as jest.Mock).mockResolvedValue(mockStaff);
      (prisma.staff.count as jest.Mock).mockResolvedValue(1);

      await staffService.getAllStaff({ status });

      expect(prisma.staff.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ status }),
        })
      );
    });
  });

  describe('updateStaff', () => {
    it('should update a staff member successfully', async () => {
      const staffId = 'staff-123';
      const updateData = { role: 'senior-veterinarian' };
      const existingStaff = { id: staffId, role: 'veterinarian' };
      const updatedStaff = { ...existingStaff, ...updateData };

      (prisma.staff.findUnique as jest.Mock).mockResolvedValue(existingStaff);
      (prisma.staff.update as jest.Mock).mockResolvedValue(updatedStaff);

      const result = await staffService.updateStaff(staffId, updateData);

      expect(result.role).toBe('senior-veterinarian');
    });
  });

  describe('deleteStaff', () => {
    it('should delete a staff member successfully', async () => {
      const staffId = 'staff-123';
      const existingStaff = { id: staffId, status: 'active' };
      const deletedStaff = { ...existingStaff, status: 'inactive' };

      (prisma.staff.findUnique as jest.Mock).mockResolvedValue(existingStaff);
      (prisma.staff.update as jest.Mock).mockResolvedValue(deletedStaff);

      const result = await staffService.deleteStaff(staffId);

      expect(result.status).toBe('inactive');
    });
  });
});
