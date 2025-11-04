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
    const breedInfo = await breedInfoService.createBreedInfo(body);
    return breedInfo ;
  }

  @Get(':id')
  async getById(@Param('id', ParseUUIDPipe) id: string) {
    const breedInfo = await breedInfoService.getBreedInfo(id);
    return breedInfo ;
  }

  async getByBreed(req: Request, res: Response) {
    const breedInfo = await breedInfoService.getBreedInfoByBreed(req.params.breed);
    return breedInfo ;
  }

  @Get()
  async getAll(@Query() query: any) {
    const { species, page, limit } = query;
    const result = await breedInfoService.listBreedInfo({
      species: species as string,
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
    });
    return result ;
  }

  @Put(':id')
  async update(@Param('id', ParseUUIDPipe) id: string, @Body(ValidationPipe) body: any) {
    const breedInfo = await breedInfoService.updateBreedInfo(id, body);
    return breedInfo ;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    await breedInfoService.deleteBreedInfo(id);
    return;
  }
}