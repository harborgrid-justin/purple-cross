import { Request, Response } from 'express';
import breedInfoService from '../services/breed-info.service';
import { HTTP_STATUS } from '../constants';

export class BreedInfoController {
  async create(req: Request, res: Response): Promise<void> {
    const breedInfo = await breedInfoService.createBreedInfo(req.body);
    res.status(HTTP_STATUS.CREATED).json({ status: 'success', data: breedInfo });
  }

  async getById(req: Request, res: Response): Promise<void> {
    const breedInfo = await breedInfoService.getBreedInfo(req.params.id);
    res.status(HTTP_STATUS.OK).json({ status: 'success', data: breedInfo });
  }

  async getByBreed(req: Request, res: Response): Promise<void> {
    const breedInfo = await breedInfoService.getBreedInfoByBreed(req.params.breed);
    res.status(HTTP_STATUS.OK).json({ status: 'success', data: breedInfo });
  }

  async getAll(req: Request, res: Response): Promise<void> {
    const { species, page, limit } = req.query;
    const result = await breedInfoService.listBreedInfo({
      species: species as string,
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
    });
    res.status(HTTP_STATUS.OK).json({ status: 'success', ...result });
  }

  async update(req: Request, res: Response): Promise<void> {
    const breedInfo = await breedInfoService.updateBreedInfo(req.params.id, req.body);
    res.status(HTTP_STATUS.OK).json({ status: 'success', data: breedInfo });
  }

  async delete(req: Request, res: Response): Promise<void> {
    await breedInfoService.deleteBreedInfo(req.params.id);
    res.status(HTTP_STATUS.NO_CONTENT).send();
  }
}

export default new BreedInfoController();
