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
import { InventoryService } from './inventory.service';

@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body(ValidationPipe) body: any) {
    const item = await this.inventoryService.createInventoryItem(body);
    return item;
  }

  @Get(':id')
  async getById(@Param('id', ParseUUIDPipe) id: string) {
    const item = await this.inventoryService.getInventoryItemById(id);
    return item;
  }

  @Get()
  async getAll(@Query() query: any) {
    const { page, limit, category, search, lowStock } = query;
    const result = await this.inventoryService.getAllInventoryItems({
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
      category: category as string,
      search: search as string,
      lowStock: lowStock === 'true',
    });
    return result;
  }

  @Put(':id')
  async update(@Param('id', ParseUUIDPipe) id: string, @Body(ValidationPipe) body: any) {
    const item = await this.inventoryService.updateInventoryItem(id, body);
    return item;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    await this.inventoryService.deleteInventoryItem(id);
    return;
  }
}