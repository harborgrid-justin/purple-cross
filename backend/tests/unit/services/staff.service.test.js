"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const staff_service_1 = require("../../../src/services/staff.service");
const database_1 = require("../../../src/config/database");
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
    let staffService;
    beforeEach(() => {
        staffService = new staff_service_1.StaffService();
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
            database_1.prisma.employee.findUnique.mockResolvedValue(null);
            database_1.prisma.employee.create.mockResolvedValue(expectedResult);
            const result = await staffService.createEmployee(employeeData);
            expect(result).toEqual(expectedResult);
        });
        it('should throw error when email already exists', async () => {
            const employeeData = {
                email: 'existing@purplecross.com',
            };
            database_1.prisma.employee.findUnique.mockResolvedValue({ id: 'existing' });
            await expect(staffService.createEmployee(employeeData)).rejects.toThrow('Employee with this email already exists');
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
            database_1.prisma.employee.findUnique.mockResolvedValue(expectedEmployee);
            const result = await staffService.getEmployeeById(employeeId);
            expect(result).toEqual(expectedEmployee);
        });
        it('should throw error when employee not found', async () => {
            const employeeId = 'non-existent';
            database_1.prisma.employee.findUnique.mockResolvedValue(null);
            await expect(staffService.getEmployeeById(employeeId)).rejects.toThrow('Employee not found');
        });
    });
    describe('getAllEmployees', () => {
        it('should return all employees with pagination', async () => {
            const mockEmployees = [
                { id: 'employee-1', firstName: 'Jane', role: 'veterinarian' },
                { id: 'employee-2', firstName: 'John', role: 'technician' },
            ];
            database_1.prisma.employee.findMany.mockResolvedValue(mockEmployees);
            database_1.prisma.employee.count.mockResolvedValue(2);
            const result = await staffService.getAllEmployees({});
            expect(result.data).toEqual(mockEmployees);
            expect(result.pagination.total).toBe(2);
        });
        it('should filter employees by role', async () => {
            const role = 'veterinarian';
            const mockEmployees = [{ id: 'employee-1', role }];
            database_1.prisma.employee.findMany.mockResolvedValue(mockEmployees);
            database_1.prisma.employee.count.mockResolvedValue(1);
            await staffService.getAllEmployees({ role });
            expect(database_1.prisma.employee.findMany).toHaveBeenCalledWith(expect.objectContaining({
                where: expect.objectContaining({ role }),
            }));
        });
        it('should filter employees by status', async () => {
            const status = 'active';
            const mockEmployees = [{ id: 'employee-1', status }];
            database_1.prisma.employee.findMany.mockResolvedValue(mockEmployees);
            database_1.prisma.employee.count.mockResolvedValue(1);
            await staffService.getAllEmployees({ status });
            expect(database_1.prisma.employee.findMany).toHaveBeenCalledWith(expect.objectContaining({
                where: expect.objectContaining({ status }),
            }));
        });
    });
    describe('updateEmployee', () => {
        it('should update an employee successfully', async () => {
            const employeeId = 'employee-123';
            const updateData = { role: 'senior-veterinarian' };
            const existingEmployee = { id: employeeId, role: 'veterinarian' };
            const updatedEmployee = { ...existingEmployee, ...updateData };
            database_1.prisma.employee.findUnique.mockResolvedValue(existingEmployee);
            database_1.prisma.employee.update.mockResolvedValue(updatedEmployee);
            const result = await staffService.updateEmployee(employeeId, updateData);
            expect(result.role).toBe('senior-veterinarian');
        });
    });
    describe('deactivateEmployee', () => {
        it('should deactivate an employee successfully', async () => {
            const employeeId = 'employee-123';
            const existingEmployee = { id: employeeId, status: 'active' };
            const deactivatedEmployee = { ...existingEmployee, status: 'inactive' };
            database_1.prisma.employee.findUnique.mockResolvedValue(existingEmployee);
            database_1.prisma.employee.update.mockResolvedValue(deactivatedEmployee);
            const result = await staffService.deactivateEmployee(employeeId);
            expect(result.status).toBe('inactive');
        });
    });
});
//# sourceMappingURL=staff.service.test.js.map