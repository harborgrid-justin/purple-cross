import { Request, Response } from 'express';
import breedInfoService from '../services/breed-info.service';

export class BreedInfoController {
  async create(req: Request, res: Response) {
    const breedInfo = await breedInfoService.createBreedInfo(req.body);
    res.status(201).json({ status: 'success', data: breedInfo });
  }

  async getById(req: Request, res: Response) {
    const breedInfo = await breedInfoService.getBreedInfo(req.params.id);
    res.status(200).json({ status: 'success', data: breedInfo });
  }

  async getByBreed(req: Request, res: Response) {
    const breedInfo = await breedInfoService.getBreedInfoByBreed(req.params.breed);
    res.status(200).json({ status: 'success', data: breedInfo });
  }

  async getAll(req: Request, res: Response) {
    const { species, page, limit } = req.query;
    const result = await breedInfoService.listBreedInfo({
      species: species as string,
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
    });
    res.status(200).json({ status: 'success', ...result });
  }

  async update(req: Request, res: Response) {
    const breedInfo = await breedInfoService.updateBreedInfo(req.params.id, req.body);
    res.status(200).json({ status: 'success', data: breedInfo });
  }

  async delete(req: Request, res: Response) {
    await breedInfoService.deleteBreedInfo(req.params.id);
    res.status(204).send();
  }
}

export default new BreedInfoController();
