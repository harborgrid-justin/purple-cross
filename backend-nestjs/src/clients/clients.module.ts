import { Module } from '@nestjs/common';
import { ClientsController } from './clients.controller';
import { ClientService } from './clients.service';

@Module({
  controllers: [ClientsController],
  providers: [ClientService],
  exports: [ClientService],
})
export class ClientsModule {}
