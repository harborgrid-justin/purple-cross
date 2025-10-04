import { StaffService } from '../../../src/services/staff.service';
import { prisma } from '../../../src/config/database';

// Mock Prisma
jest.mock('../../../src/config/database', () => ({
  prisma: {
    employee: {
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

  describe('createEmployee', () => {
    it('should create an employee successfully', async () => {
      const employeeData = {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@purplecross.com',
        role: 'veterinarian',
        licenseNumber: 'VET-12345',
        hireDate: new Date('2024-01-01'),
      };

      const expectedResult = {
        id: 'employee-123',
        ...employeeData,
      };

      (prisma.employee.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.employee.create as jest.Mock).mockResolvedValue(expectedResult);

      const result = await staffService.createEmployee(employeeData);

      expect(result).toEqual(expectedResult);
    });

    it('should throw error when email already exists', async () => {
      const employeeData = {
        email: 'existing@purplecross.com',
      };

      (prisma.employee.findUnique as jest.Mock).mockResolvedValue({ id: 'existing' });

      await expect(staffService.createEmployee(employeeData)).rejects.toThrow(
        'Employee with this email already exists'
      );
    });
  });

  describe('getEmployeeById', () => {
    it('should return an employee when found', async () => {
      const employeeId = 'employee-123';
      const expectedEmployee = {
        id: employeeId,
        firstName: 'Jane',
        lastName: 'Smith',
        role: 'veterinarian',
      };

      (prisma.employee.findUnique as jest.Mock).mockResolvedValue(expectedEmployee);

      const result = await staffService.getEmployeeById(employeeId);

      expect(result).toEqual(expectedEmployee);
    });

    it('should throw error when employee not found', async () => {
      const employeeId = 'non-existent';

      (prisma.employee.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(staffService.getEmployeeById(employeeId)).rejects.toThrow('Employee not found');
    });
  });

  describe('getAllEmployees', () => {
    it('should return all employees with pagination', async () => {
      const mockEmployees = [
        { id: 'employee-1', firstName: 'Jane', role: 'veterinarian' },
        { id: 'employee-2', firstName: 'John', role: 'technician' },
      ];

      (prisma.employee.findMany as jest.Mock).mockResolvedValue(mockEmployees);
      (prisma.employee.count as jest.Mock).mockResolvedValue(2);

      const result = await staffService.getAllEmployees({});

      expect(result.data).toEqual(mockEmployees);
      expect(result.pagination.total).toBe(2);
    });

    it('should filter employees by role', async () => {
      const role = 'veterinarian';
      const mockEmployees = [{ id: 'employee-1', role }];

      (prisma.employee.findMany as jest.Mock).mockResolvedValue(mockEmployees);
      (prisma.employee.count as jest.Mock).mockResolvedValue(1);

      await staffService.getAllEmployees({ role });

      expect(prisma.employee.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ role }),
        })
      );
    });

    it('should filter employees by status', async () => {
      const status = 'active';
      const mockEmployees = [{ id: 'employee-1', status }];

      (prisma.employee.findMany as jest.Mock).mockResolvedValue(mockEmployees);
      (prisma.employee.count as jest.Mock).mockResolvedValue(1);

      await staffService.getAllEmployees({ status });

      expect(prisma.employee.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ status }),
        })
      );
    });
  });

  describe('updateEmployee', () => {
    it('should update an employee successfully', async () => {
      const employeeId = 'employee-123';
      const updateData = { role: 'senior-veterinarian' };
      const existingEmployee = { id: employeeId, role: 'veterinarian' };
      const updatedEmployee = { ...existingEmployee, ...updateData };

      (prisma.employee.findUnique as jest.Mock).mockResolvedValue(existingEmployee);
      (prisma.employee.update as jest.Mock).mockResolvedValue(updatedEmployee);

      const result = await staffService.updateEmployee(employeeId, updateData);

      expect(result.role).toBe('senior-veterinarian');
    });
  });

  describe('deactivateEmployee', () => {
    it('should deactivate an employee successfully', async () => {
      const employeeId = 'employee-123';
      const existingEmployee = { id: employeeId, status: 'active' };
      const deactivatedEmployee = { ...existingEmployee, status: 'inactive' };

      (prisma.employee.findUnique as jest.Mock).mockResolvedValue(existingEmployee);
      (prisma.employee.update as jest.Mock).mockResolvedValue(deactivatedEmployee);

      const result = await staffService.deactivateEmployee(employeeId);

      expect(result.status).toBe('inactive');
    });
  });
});
