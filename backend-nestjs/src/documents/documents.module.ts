import { Module } from '@nestjs/common';
import { DocumentsController } from './documents.controller';
import { DocumentService } from './documents.service';

@Module({
  controllers: [DocumentsController],
  providers: [DocumentService],
  exports: [DocumentService],
})
export class DocumentsModule {}
