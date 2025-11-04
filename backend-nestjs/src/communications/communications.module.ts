import { Module } from '@nestjs/common';
import { CommunicationsController } from './communications.controller';
import { CommunicationService } from './communications.service';

@Module({
  controllers: [CommunicationsController],
  providers: [CommunicationService],
  exports: [CommunicationService],
})
export class CommunicationsModule {}
