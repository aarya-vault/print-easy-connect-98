
import { Order, OrderStatus, OrderType, Prisma } from '@prisma/client';
import { BaseService } from './BaseService';
import { CreateOrderSchema, UpdateOrderSchema, QuerySchema } from '../lib/validations';

export class OrderService extends BaseService {
  async createOrder(customerId: number, data: {
    shopId: number;
    orderType: OrderType;
    description: string;
    instructions?: string;
    services?: string[];
    pages?: number;
    copies?: number;
    paperType?: string;
    binding?: string;
    color?: boolean;
  }): Promise<Order> {
    try {
      const validatedData = CreateOrderSchema.parse(data);
      
      // Generate order ID based on type
      const orderType = validatedData.orderType;
      const prefix = orderType === 'uploaded-files' ? 'UF' : 'WI';
      
      // Get next sequence number (simplified version)
      const lastOrder = await this.prisma.order.findFirst({
        where: { id: { startsWith: prefix } },
        orderBy: { createdAt: 'desc' },
      });
      
      let nextNumber = 1;
      if (lastOrder) {
        const currentNumber = parseInt(lastOrder.id.substring(2));
        nextNumber = currentNumber + 1;
      }
      
      const orderId = `${prefix}${nextNumber.toString().padStart(3, '0')}`;

      return await this.prisma.order.create({
        data: {
          id: orderId,
          customerId,
          ...validatedData,
          services: validatedData.services || [],
        },
        include: {
          customer: {
            select: { id: true, name: true, phone: true, email: true }
          },
          shop: {
            select: { id: true, name: true, address: true }
          },
        },
      });
    } catch (error) {
      return this.handlePrismaError(error);
    }
  }

  async findOrderById(id: string, userId?: number, userRole?: string): Promise<Order | null> {
    try {
      const where: Prisma.OrderWhereInput = { id };
      
      // Add access control based on user role
      if (userId && userRole) {
        if (userRole === 'customer') {
          where.customerId = userId;
        } else if (userRole === 'shop_owner') {
          where.shop = { ownerId: userId };
        }
        // Admin can access all orders
      }

      return await this.prisma.order.findFirst({
        where,
        include: {
          customer: {
            select: { id: true, name: true, phone: true, email: true }
          },
          shop: {
            select: { id: true, name: true, address: true, phone: true }
          },
          files: true,
          statusHistory: {
            orderBy: { changedAt: 'desc' },
            take: 10,
          },
        },
      });
    } catch (error) {
      return this.handlePrismaError(error);
    }
  }

  async getShopOrders(shopId: number, query: {
    page?: number;
    limit?: number;
    status?: OrderStatus;
    orderType?: OrderType;
    urgent?: boolean;
    search?: string;
  }) {
    try {
      const validatedQuery = QuerySchema.parse(query);
      const { skip, take } = this.getPagination(validatedQuery.page, validatedQuery.limit);
      
      const where: Prisma.OrderWhereInput = {
        shopId,
        ...(validatedQuery.status && { status: validatedQuery.status }),
        ...(validatedQuery.orderType && { orderType: validatedQuery.orderType }),
        ...(validatedQuery.urgent !== undefined && { isUrgent: validatedQuery.urgent }),
        ...(validatedQuery.search && {
          OR: [
            { id: { contains: validatedQuery.search, mode: 'insensitive' } },
            { description: { contains: validatedQuery.search, mode: 'insensitive' } },
            { customer: { name: { contains: validatedQuery.search, mode: 'insensitive' } } },
            { customer: { phone: { contains: validatedQuery.search, mode: 'insensitive' } } },
          ],
        }),
      };

      const [orders, total] = await Promise.all([
        this.prisma.order.findMany({
          where,
          skip,
          take,
          orderBy: [
            { isUrgent: 'desc' },
            { createdAt: 'desc' },
          ],
          include: {
            customer: {
              select: { id: true, name: true, phone: true, email: true }
            },
            files: {
              select: { id: true, originalName: true, mimeType: true, fileSize: true }
            },
          },
        }),
        this.prisma.order.count({ where }),
      ]);

      return {
        orders,
        pagination: {
          page: validatedQuery.page,
          limit: validatedQuery.limit,
          total,
          pages: Math.ceil(total / validatedQuery.limit),
        },
      };
    } catch (error) {
      return this.handlePrismaError(error);
    }
  }

  async getCustomerOrders(customerId: number, query: {
    page?: number;
    limit?: number;
    status?: OrderStatus;
  }) {
    try {
      const validatedQuery = QuerySchema.parse(query);
      const { skip, take } = this.getPagination(validatedQuery.page, validatedQuery.limit);
      
      const where: Prisma.OrderWhereInput = {
        customerId,
        ...(validatedQuery.status && { status: validatedQuery.status }),
      };

      const [orders, total] = await Promise.all([
        this.prisma.order.findMany({
          where,
          skip,
          take,
          orderBy: { createdAt: 'desc' },
          include: {
            shop: {
              select: { id: true, name: true, address: true, phone: true }
            },
            files: {
              select: { id: true, originalName: true, mimeType: true, fileSize: true }
            },
          },
        }),
        this.prisma.order.count({ where }),
      ]);

      return {
        orders,
        pagination: {
          page: validatedQuery.page,
          limit: validatedQuery.limit,
          total,
          pages: Math.ceil(total / validatedQuery.limit),
        },
      };
    } catch (error) {
      return this.handlePrismaError(error);
    }
  }

  async updateOrderStatus(id: string, status: OrderStatus, changedBy: string, notes?: string): Promise<Order> {
    try {
      const validatedData = UpdateOrderSchema.parse({ status });
      
      return await this.prisma.$transaction(async (tx) => {
        // Get current order
        const currentOrder = await tx.order.findUnique({ where: { id } });
        if (!currentOrder) throw new Error('Order not found');

        // Update order
        const updatedOrder = await tx.order.update({
          where: { id },
          data: { status: validatedData.status },
          include: {
            customer: {
              select: { id: true, name: true, phone: true }
            },
            shop: {
              select: { id: true, name: true }
            },
          },
        });

        // Log status change
        await tx.orderStatusHistory.create({
          data: {
            orderId: id,
            oldStatus: currentOrder.status,
            newStatus: validatedData.status!,
            changedBy,
            notes,
          },
        });

        return updatedOrder;
      });
    } catch (error) {
      return this.handlePrismaError(error);
    }
  }

  async toggleOrderUrgency(id: string): Promise<Order> {
    try {
      const currentOrder = await this.prisma.order.findUnique({ where: { id } });
      if (!currentOrder) throw new Error('Order not found');

      return await this.prisma.order.update({
        where: { id },
        data: { isUrgent: !currentOrder.isUrgent },
      });
    } catch (error) {
      return this.handlePrismaError(error);
    }
  }

  async deleteOrder(id: string): Promise<void> {
    try {
      await this.prisma.order.delete({ where: { id } });
    } catch (error) {
      return this.handlePrismaError(error);
    }
  }
}
