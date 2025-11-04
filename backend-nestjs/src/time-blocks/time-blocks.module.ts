import { Module } from '@nestjs/common';
import { TimeBlocksController } from './time-blocks.controller';
import { TimeBlockService } from './time-blocks.service';

@Module({
  controllers: [TimeBlocksController],
  providers: [TimeBlockService],
  exports: [TimeBlockService],
})
export class TimeBlocksModule {}
