import { AppointmentService } from '../../../src/services/appointment.service';
import { prisma } from '../../../src/config/database';

// Mock Prisma
jest.mock('../../../src/config/database', () => ({
  prisma: {
    appointment: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

describe('AppointmentService', () => {
  let appointmentService: AppointmentService;

  beforeEach(() => {
    appointmentService = new AppointmentService();
    jest.clearAllMocks();
  });

  describe('createAppointment', () => {
    it('should create an appointment successfully', async () => {
      const appointmentData = {
        patientId: 'patient-123',
        clientId: 'client-123',
        startTime: new Date('2024-12-01T10:00:00Z'),
        endTime: new Date('2024-12-01T11:00:00Z'),
        type: 'checkup',
        status: 'scheduled',
      };

      const expectedResult = {
        id: 'appointment-123',
        ...appointmentData,
      };

      (prisma.appointment.create as jest.Mock).mockResolvedValue(expectedResult);

      const result = await appointmentService.createAppointment(appointmentData);

      expect(prisma.appointment.create).toHaveBeenCalledWith({
        data: appointmentData,
        include: {
          patient: true,
          client: true,
          staff: true,
        },
      });
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getAppointmentById', () => {
    it('should return an appointment when found', async () => {
      const appointmentId = 'appointment-123';
      const expectedAppointment = {
        id: appointmentId,
        patientId: 'patient-123',
        startTime: new Date('2024-12-01T10:00:00Z'),
        status: 'scheduled',
      };

      (prisma.appointment.findUnique as jest.Mock).mockResolvedValue(expectedAppointment);

      const result = await appointmentService.getAppointmentById(appointmentId);

      expect(result).toEqual(expectedAppointment);
    });

    it('should throw error when appointment not found', async () => {
      const appointmentId = 'non-existent';

      (prisma.appointment.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(appointmentService.getAppointmentById(appointmentId)).rejects.toThrow(
        'Appointment not found'
      );
    });
  });

  describe('getAllAppointments', () => {
    it('should return paginated appointments with default options', async () => {
      const mockAppointments = [
        { id: 'appointment-1', status: 'scheduled' },
        { id: 'appointment-2', status: 'completed' },
      ];

      (prisma.appointment.findMany as jest.Mock).mockResolvedValue(mockAppointments);
      (prisma.appointment.count as jest.Mock).mockResolvedValue(2);

      const result = await appointmentService.getAllAppointments({});

      expect(result.data).toEqual(mockAppointments);
      expect(result.pagination).toEqual({
        page: 1,
        limit: 20,
        total: 2,
        totalPages: 1,
      });
    });

    it('should filter appointments by date range', async () => {
      const startDate = new Date('2024-12-01');
      const endDate = new Date('2024-12-31');
      const mockAppointments = [{ id: 'appointment-1' }];

      (prisma.appointment.findMany as jest.Mock).mockResolvedValue(mockAppointments);
      (prisma.appointment.count as jest.Mock).mockResolvedValue(1);

      await appointmentService.getAllAppointments({ startDate, endDate });

      expect(prisma.appointment.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            startTime: {
              gte: startDate,
              lte: endDate,
            },
          }),
        })
      );
    });

    it('should filter appointments by status', async () => {
      const status = 'scheduled';
      const mockAppointments = [{ id: 'appointment-1', status }];

      (prisma.appointment.findMany as jest.Mock).mockResolvedValue(mockAppointments);
      (prisma.appointment.count as jest.Mock).mockResolvedValue(1);

      await appointmentService.getAllAppointments({ status });

      expect(prisma.appointment.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ status }),
        })
      );
    });
  });

  describe('updateAppointment', () => {
    it('should update an appointment successfully', async () => {
      const appointmentId = 'appointment-123';
      const updateData = { status: 'completed' };
      const existingAppointment = { id: appointmentId, status: 'scheduled' };
      const updatedAppointment = { ...existingAppointment, ...updateData };

      (prisma.appointment.findUnique as jest.Mock).mockResolvedValue(existingAppointment);
      (prisma.appointment.update as jest.Mock).mockResolvedValue(updatedAppointment);

      const result = await appointmentService.updateAppointment(appointmentId, updateData);

      expect(prisma.appointment.update).toHaveBeenCalledWith({
        where: { id: appointmentId },
        data: updateData,
        include: {
          patient: true,
          client: true,
          staff: true,
        },
      });
      expect(result.status).toBe('completed');
    });

    it('should throw error when updating non-existent appointment', async () => {
      const appointmentId = 'non-existent';

      (prisma.appointment.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(appointmentService.updateAppointment(appointmentId, {})).rejects.toThrow(
        'Appointment not found'
      );
    });
  });

  describe('deleteAppointment', () => {
    it('should cancel an appointment successfully', async () => {
      const appointmentId = 'appointment-123';
      const existingAppointment = { id: appointmentId, status: 'scheduled' };
      const cancelledAppointment = { ...existingAppointment, status: 'cancelled' };

      (prisma.appointment.findUnique as jest.Mock).mockResolvedValue(existingAppointment);
      (prisma.appointment.update as jest.Mock).mockResolvedValue(cancelledAppointment);

      const result = await appointmentService.deleteAppointment(appointmentId);

      expect(prisma.appointment.update).toHaveBeenCalledWith({
        where: { id: appointmentId },
        data: { status: 'cancelled' },
      });
      expect(result.status).toBe('cancelled');
    });
  });
});
