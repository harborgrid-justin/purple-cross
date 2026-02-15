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
import { BreedInfoService } from './breed-info.service';

@Controller('breed-info')
export class BreedInfoController {
  constructor(private readonly breedInfoService: BreedInfoService) {}
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body(ValidationPipe) body: any) {
    const breedInfo = await this.breedInfoService.createBreedInfo(body);
    return breedInfo ;
  }

  @Get(':id')
  async getById(@Param('id', ParseUUIDPipe) id: string) {
    const breedInfo = await this.breedInfoService.getBreedInfo(id);
    return breedInfo ;
  }

  @Get('breed/:breed')
  async getByBreed(@Param('breed') breed: string) {
    const breedInfo = await this.breedInfoService.getBreedInfoByBreed(breed);
    return breedInfo;
  }

  @Get()
  async getAll(@Query() query: any) {
    const { species, page, limit } = query;
    const result = await this.breedInfoService.listBreedInfo({
      species: species as string,
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
    });
    return result ;
  }

  @Put(':id')
  async update(@Param('id', ParseUUIDPipe) id: string, @Body(ValidationPipe) body: any) {
    const breedInfo = await this.breedInfoService.updateBreedInfo(id, body);
    return breedInfo ;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    await this.breedInfoService.deleteBreedInfo(id);
    return;
  }
}