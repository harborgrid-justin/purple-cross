import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class LoyaltyProgramService {
  async createProgram(clientId: string) {
    return prisma.loyaltyProgram.create({
      data: {
        clientId,
        pointsBalance: 0,
        tier: 'bronze',
        lifetimePoints: 0,
        lifetimeSpending: 0,
      },
    });
  }

  async getProgram(id: string) {
    return prisma.loyaltyProgram.findUnique({
      where: { id },
      include: {
        transactions: {
          orderBy: { transactionDate: 'desc' },
          take: 10,
        },
      },
    });
  }

  async getProgramByClient(clientId: string) {
    return prisma.loyaltyProgram.findUnique({
      where: { clientId },
      include: {
        transactions: {
          orderBy: { transactionDate: 'desc' },
          take: 10,
        },
      },
    });
  }

  async addPoints(
    clientId: string,
    points: number,
    description: string,
    relatedType?: string,
    relatedId?: string
  ) {
    let program = await this.getProgramByClient(clientId);

    if (!program) {
      program = await this.createProgram(clientId);
    }

    const newBalance = program.pointsBalance + points;
    const newLifetimePoints = program.lifetimePoints + points;

    const tier = this.calculateTier(newLifetimePoints);

    const [updatedProgram] = await Promise.all([
      prisma.loyaltyProgram.update({
        where: { id: program.id },
        data: {
          pointsBalance: newBalance,
          lifetimePoints: newLifetimePoints,
          tier,
          lastActivityDate: new Date(),
        },
      }),
      prisma.loyaltyTransaction.create({
        data: {
          loyaltyProgramId: program.id,
          transactionType: 'earn',
          points,
          description,
          relatedType,
          relatedId,
        },
      }),
    ]);

    return updatedProgram;
  }

  async redeemPoints(clientId: string, points: number, description: string) {
    const program = await this.getProgramByClient(clientId);

    if (!program) {
      throw new Error('Loyalty program not found');
    }

    if (program.pointsBalance < points) {
      throw new Error('Insufficient points');
    }

    const newBalance = program.pointsBalance - points;

    const [updatedProgram] = await Promise.all([
      prisma.loyaltyProgram.update({
        where: { id: program.id },
        data: {
          pointsBalance: newBalance,
          lastActivityDate: new Date(),
        },
      }),
      prisma.loyaltyTransaction.create({
        data: {
          loyaltyProgramId: program.id,
          transactionType: 'redeem',
          points: -points,
          description,
        },
      }),
    ]);

    return updatedProgram;
  }

  async updateSpending(clientId: string, amount: number) {
    let program = await this.getProgramByClient(clientId);

    if (!program) {
      program = await this.createProgram(clientId);
    }

    const points = Math.floor(amount / 10); // 1 point per $10 spent
    const newSpending = program.lifetimeSpending + amount;
    const tier = this.calculateTier(program.lifetimePoints + points);

    return prisma.loyaltyProgram.update({
      where: { id: program.id },
      data: {
        pointsBalance: program.pointsBalance + points,
        lifetimePoints: program.lifetimePoints + points,
        lifetimeSpending: newSpending,
        tier,
        lastActivityDate: new Date(),
      },
    });
  }

  private calculateTier(lifetimePoints: number): string {
    if (lifetimePoints >= 10000) return 'platinum';
    if (lifetimePoints >= 5000) return 'gold';
    if (lifetimePoints >= 1000) return 'silver';
    return 'bronze';
  }

  async getTransactions(loyaltyProgramId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      prisma.loyaltyTransaction.findMany({
        where: { loyaltyProgramId },
        skip,
        take: limit,
        orderBy: { transactionDate: 'desc' },
      }),
      prisma.loyaltyTransaction.count({
        where: { loyaltyProgramId },
      }),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async listPrograms(filters?: { tier?: string; page?: number; limit?: number }) {
    const { tier, page = 1, limit = 20 } = filters || {};
    const skip = (page - 1) * limit;
    const where: any = {};
    if (tier) where.tier = tier;
    const [items, total] = await Promise.all([
      prisma.loyaltyProgram.findMany({
        where,
        skip,
        take: limit,
        orderBy: { lifetimePoints: 'desc' },
      }),
      prisma.loyaltyProgram.count({ where }),
    ]);
    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async updateProgram(id: string, data: any) {
    return prisma.loyaltyProgram.update({ where: { id }, data });
  }

  async deleteProgram(id: string) {
    return prisma.loyaltyProgram.delete({ where: { id } });
  }
}

export default new LoyaltyProgramService();
