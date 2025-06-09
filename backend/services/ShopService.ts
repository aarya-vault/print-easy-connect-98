
import { Shop, User } from '@prisma/client';
import { BaseService } from './BaseService';
import { CreateShopSchema, UpdateShopSchema } from '../lib/validations';

export class ShopService extends BaseService {
  async createShop(ownerId: number, data: {
    name: string;
    address: string;
    phone: string;
    email?: string;
    openingTime?: string;
    closingTime?: string;
  }): Promise<Shop> {
    try {
      const validatedData = CreateShopSchema.parse(data);
      
      // Generate slug from name
      const slug = validatedData.name
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');

      return await this.prisma.shop.create({
        data: {
          ownerId,
          ...validatedData,
          slug: `${slug}-${Date.now()}`, // Ensure uniqueness
        },
      });
    } catch (error) {
      return this.handlePrismaError(error);
    }
  }

  async findShopById(id: number): Promise<Shop | null> {
    try {
      return await this.prisma.shop.findUnique({
        where: { id, isActive: true },
        include: {
          owner: {
            select: { id: true, name: true, email: true, phone: true }
          }
        }
      });
    } catch (error) {
      return this.handlePrismaError(error);
    }
  }

  async findShopBySlug(slug: string): Promise<Shop | null> {
    try {
      return await this.prisma.shop.findUnique({
        where: { slug, isActive: true },
        include: {
          owner: {
            select: { id: true, name: true, email: true, phone: true }
          }
        }
      });
    } catch (error) {
      return this.handlePrismaError(error);
    }
  }

  async findShopByOwner(ownerId: number): Promise<Shop | null> {
    try {
      return await this.prisma.shop.findFirst({
        where: { ownerId, isActive: true },
      });
    } catch (error) {
      return this.handlePrismaError(error);
    }
  }

  async getAllShops(page: number = 1, limit: number = 10, search?: string) {
    try {
      const { skip, take } = this.getPagination(page, limit);
      
      const where = {
        isActive: true,
        ...(search && {
          OR: [
            { name: { contains: search, mode: 'insensitive' as const } },
            { address: { contains: search, mode: 'insensitive' as const } },
          ],
        }),
      };

      const [shops, total] = await Promise.all([
        this.prisma.shop.findMany({
          where,
          skip,
          take,
          orderBy: { name: 'asc' },
          select: {
            id: true,
            name: true,
            slug: true,
            address: true,
            phone: true,
            openingTime: true,
            closingTime: true,
            rating: true,
            totalReviews: true,
            isActive: true,
          },
        }),
        this.prisma.shop.count({ where }),
      ]);

      return {
        shops,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      return this.handlePrismaError(error);
    }
  }

  async updateShop(id: number, data: Partial<{
    name: string;
    address: string;
    phone: string;
    email: string;
    openingTime: string;
    closingTime: string;
  }>): Promise<Shop> {
    try {
      const validatedData = UpdateShopSchema.parse(data);
      
      return await this.prisma.shop.update({
        where: { id },
        data: validatedData,
      });
    } catch (error) {
      return this.handlePrismaError(error);
    }
  }

  async getShopStats(shopId: number) {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const [todayOrders, urgentOrders, pendingOrders, totalOrders] = await Promise.all([
        this.prisma.order.count({
          where: { shopId, createdAt: { gte: today } }
        }),
        this.prisma.order.count({
          where: { shopId, isUrgent: true, status: { in: ['new', 'confirmed', 'processing'] } }
        }),
        this.prisma.order.count({
          where: { shopId, status: { in: ['new', 'confirmed', 'processing'] } }
        }),
        this.prisma.order.count({
          where: { shopId }
        }),
      ]);

      return {
        todayOrders,
        urgentOrders,
        pendingOrders,
        totalOrders,
      };
    } catch (error) {
      return this.handlePrismaError(error);
    }
  }

  async deactivateShop(id: number): Promise<void> {
    try {
      await this.prisma.shop.update({
        where: { id },
        data: { isActive: false },
      });
    } catch (error) {
      return this.handlePrismaError(error);
    }
  }
}
