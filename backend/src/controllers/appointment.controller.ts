import { Request, Response } from 'express';
import appointmentService from '../services/appointment.service';

export class AppointmentController {
  async create(req: Request, res: Response) {
    const appointment = await appointmentService.createAppointment(req.body);
    res.status(201).json({
      status: 'success',
      data: appointment,
    });
  }

  async getById(req: Request, res: Response) {
    const appointment = await appointmentService.getAppointmentById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: appointment,
    });
  }

  async getAll(req: Request, res: Response) {
    const { page, limit, patientId, clientId, veterinarianId, status, startDate, endDate } =
      req.query;
    const result = await appointmentService.getAllAppointments({
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
      patientId: patientId as string,
      clientId: clientId as string,
      veterinarianId: veterinarianId as string,
      status: status as string,
      startDate: startDate ? new Date(startDate as string) : undefined,
      endDate: endDate ? new Date(endDate as string) : undefined,
    });
    res.status(200).json({
      status: 'success',
      ...result,
    });
  }

  async update(req: Request, res: Response) {
    const appointment = await appointmentService.updateAppointment(req.params.id, req.body);
    res.status(200).json({
      status: 'success',
      data: appointment,
    });
  }

  async delete(req: Request, res: Response) {
    await appointmentService.deleteAppointment(req.params.id);
    res.status(204).send();
  }

  async complete(req: Request, res: Response) {
    const appointment = await appointmentService.completeAppointment(req.params.id);
    res.status(200).json({
      status: 'success',
      data: appointment,
    });
  }
}

export default new AppointmentController();
