import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { HTTP_STATUS, ERROR_MESSAGES, PAGINATION, QUERY_MODE, SORT_ORDER, FIELDS, WORKFLOW_EVENTS, QUERY_LIMITS } from '../common/constants';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class BreedInfoService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}
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
    return this.prisma.breedInformation.create({
      data,
    });
  }

  async getBreedInfo(id: string) {
    return this.prisma.breedInformation.findUnique({
      where: { id },
    });
  }

  async getBreedInfoByBreed(breed: string) {
    return this.prisma.breedInformation.findUnique({
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
      this.prisma.breedInformation.findMany({
        where,
        skip,
        take: limit,
        orderBy: { breed: 'asc' },
      }),
      this.prisma.breedInformation.count({ where }),
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
    return this.prisma.breedInformation.update({
      where: { id },
      data,
    });
  }

  async deleteBreedInfo(id: string) {
    return this.prisma.breedInformation.delete({
      where: { id },
    });
  }
}