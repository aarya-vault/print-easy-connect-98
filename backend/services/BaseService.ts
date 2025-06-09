
import { PrismaClient, Prisma } from '@prisma/client';
import prisma from '../lib/prisma';

export abstract class BaseService {
  protected prisma: PrismaClient;

  constructor() {
    this.prisma = prisma;
  }

  protected async handlePrismaError(error: any): Promise<never> {
    console.error('Prisma error:', error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2002':
          throw new Error(`Unique constraint violation: ${error.meta?.target}`);
        case 'P2025':
          throw new Error('Record not found');
        case 'P2003':
          throw new Error('Foreign key constraint violation');
        default:
          throw new Error(`Database error: ${error.message}`);
      }
    }

    if (error instanceof Prisma.PrismaClientValidationError) {
      throw new Error(`Validation error: ${error.message}`);
    }

    throw new Error('Internal server error');
  }

  protected getPagination(page: number, limit: number) {
    const skip = (page - 1) * limit;
    return { skip, take: limit };
  }

  protected getOrderBy(sort?: string, order: 'asc' | 'desc' = 'desc') {
    if (!sort) return { createdAt: order };
    return { [sort]: order };
  }
}
