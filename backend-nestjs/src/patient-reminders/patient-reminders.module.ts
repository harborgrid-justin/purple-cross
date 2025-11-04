import { Module } from '@nestjs/common';
import { PatientRemindersController } from './patient-reminders.controller';
import { PatientReminderService } from './patient-reminders.service';

@Module({
  controllers: [PatientRemindersController],
  providers: [PatientReminderService],
  exports: [PatientReminderService],
})
export class PatientRemindersModule {}
