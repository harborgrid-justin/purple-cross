import { Module } from '@nestjs/common';
import { BreedInfoController } from './breed-info.controller';
import { BreedInfoService } from './breed-info.service';

@Module({
  controllers: [BreedInfoController],
  providers: [BreedInfoService],
  exports: [BreedInfoService],
})
export class BreedInfoModule {}
