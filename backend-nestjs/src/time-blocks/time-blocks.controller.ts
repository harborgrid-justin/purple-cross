import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
  ValidationPipe,
} from '@nestjs/common';
import { TimeBlockService } from './time-blocks.service';

@Controller('time-blocks')
export class TimeBlocksController {
  constructor(private readonly timeBlocksService: TimeBlockService) {}
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body(ValidationPipe) body: any) {
    const timeBlock = await timeBlockService.createTimeBlock(body);
    return timeBlock ;
  }

  @Get(':id')
  async getById(@Param('id', ParseUUIDPipe) id: string) {
    const timeBlock = await timeBlockService.getTimeBlock(id);
    return timeBlock ;
  }

  @Get()
  async getAll(@Query() query: any) {
    const { staffId, blockType, startDate, endDate, page, limit } = query;
    const result = await timeBlockService.listTimeBlocks({
      staffId: staffId as string,
      blockType: blockType as string,
      startDate: startDate ? new Date(startDate as string) : undefined,
      endDate: endDate ? new Date(endDate as string) : undefined,
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
    });
    return result ;
  }

  @Put(':id')
  async update(@Param('id', ParseUUIDPipe) id: string, @Body(ValidationPipe) body: any) {
    const timeBlock = await timeBlockService.updateTimeBlock(id, body);
    return timeBlock ;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    await timeBlockService.deleteTimeBlock(id);
    return;
  }
}