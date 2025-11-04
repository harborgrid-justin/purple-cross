import { Module } from '@nestjs/common';
import { AppointmentsController } from './appointments.controller';
import { AppointmentService } from './appointments.service';

@Module({
  controllers: [AppointmentsController],
  providers: [AppointmentService],
  exports: [AppointmentService],
})
export class AppointmentsModule {}
