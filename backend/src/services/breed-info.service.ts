import { prisma } from '../config/database';
import { PAGINATION } from '../constants';


export class BreedInfoService {
  async createBreedInfo(data: {
    breed: string;
    species: string;
    commonHealthIssues?: any;
    geneticPredispositions?: any;
    careGuidelines?: any;
    nutritionalNeeds?: any;
    averageLifespan?: number;
    temperament?: string;
  }) {
    return prisma.breedInformation.create({
      data,
    });
  }

  async getBreedInfo(id: string) {
    return prisma.breedInformation.findUnique({
      where: { id },
    });
  }

  async getBreedInfoByBreed(breed: string) {
    return prisma.breedInformation.findUnique({
      where: { breed },
    });
  }

  async listBreedInfo(filters?: { species?: string; page?: number; limit?: number }) {
    const {
      species,
      page = PAGINATION.DEFAULT_PAGE,
      limit = PAGINATION.DEFAULT_LIMIT,
    } = filters || {};
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (species) where.species = species;

    const [items, total] = await Promise.all([
      prisma.breedInformation.findMany({
        where,
        skip,
        take: limit,
        orderBy: { breed: 'asc' },
      }),
      prisma.breedInformation.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async updateBreedInfo(
    id: string,
    data: {
      commonHealthIssues?: any;
      geneticPredispositions?: any;
      careGuidelines?: any;
      nutritionalNeeds?: any;
      averageLifespan?: number;
      temperament?: string;
    }
  ) {
    return prisma.breedInformation.update({
      where: { id },
      data,
    });
  }

  async deleteBreedInfo(id: string) {
    return prisma.breedInformation.delete({
      where: { id },
    });
  }
}

export default new BreedInfoService();
