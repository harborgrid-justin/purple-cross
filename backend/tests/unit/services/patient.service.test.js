"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const patient_service_1 = require("../../../src/services/patient.service");
const database_1 = require("../../../src/config/database");
// Mock Prisma
jest.mock('../../../src/config/database', () => ({
    prisma: {
        patient: {
            create: jest.fn(),
            findUnique: jest.fn(),
            findMany: jest.fn(),
            count: jest.fn(),
            update: jest.fn(),
        },
    },
}));
describe('PatientService', () => {
    let patientService;
    beforeEach(() => {
        patientService = new patient_service_1.PatientService();
        jest.clearAllMocks();
    });
    describe('createPatient', () => {
        it('should create a patient successfully', async () => {
            const patientData = {
                name: 'Max',
                species: 'Dog',
                breed: 'Labrador',
                dateOfBirth: new Date('2020-01-01'),
                gender: 'Male',
                owner: { connect: { id: 'owner-123' } },
            };
            const expectedResult = {
                id: 'patient-123',
                ...patientData,
                owner: { id: 'owner-123', firstName: 'John', lastName: 'Doe' },
            };
            database_1.prisma.patient.create.mockResolvedValue(expectedResult);
            const result = await patientService.createPatient(patientData);
            expect(database_1.prisma.patient.create).toHaveBeenCalledWith({
                data: patientData,
                include: { owner: true },
            });
            expect(result).toEqual(expectedResult);
        });
    });
    describe('getPatientById', () => {
        it('should return a patient when found', async () => {
            const patientId = 'patient-123';
            const expectedPatient = {
                id: patientId,
                name: 'Max',
                species: 'Dog',
            };
            database_1.prisma.patient.findUnique.mockResolvedValue(expectedPatient);
            const result = await patientService.getPatientById(patientId);
            expect(result).toEqual(expectedPatient);
        });
        it('should throw error when patient not found', async () => {
            const patientId = 'non-existent';
            database_1.prisma.patient.findUnique.mockResolvedValue(null);
            await expect(patientService.getPatientById(patientId)).rejects.toThrow('Patient not found');
        });
    });
});
//# sourceMappingURL=patient.service.test.js.map