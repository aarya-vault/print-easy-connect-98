
import { ChatMessage } from '@prisma/client';
import { BaseService } from './BaseService';
import { SendMessageSchema } from '../lib/validations';

export class ChatService extends BaseService {
  async sendMessage(senderId: number, data: {
    orderId: string;
    message: string;
    recipientId: number;
  }): Promise<ChatMessage> {
    try {
      const validatedData = SendMessageSchema.parse(data);
      
      // Verify user has access to this order
      const order = await this.prisma.order.findFirst({
        where: {
          id: validatedData.orderId,
          OR: [
            { customerId: senderId },
            { shop: { ownerId: senderId } },
          ],
        },
      });

      if (!order) throw new Error('Order not found or access denied');

      return await this.prisma.chatMessage.create({
        data: {
          orderId: validatedData.orderId,
          senderId,
          recipientId: validatedData.recipientId,
          message: validatedData.message,
        },
        include: {
          sender: {
            select: { id: true, name: true }
          },
          recipient: {
            select: { id: true, name: true }
          },
        },
      });
    } catch (error) {
      return this.handlePrismaError(error);
    }
  }

  async getOrderMessages(orderId: string, userId: number, userRole: string): Promise<ChatMessage[]> {
    try {
      // Verify user has access to this order
      const order = await this.prisma.order.findFirst({
        where: {
          id: orderId,
          ...(userRole === 'customer' ? { customerId: userId } : {}),
          ...(userRole === 'shop_owner' ? { shop: { ownerId: userId } } : {}),
        },
      });

      if (!order) throw new Error('Order not found or access denied');

      // Mark messages as read for current user
      await this.prisma.chatMessage.updateMany({
        where: {
          orderId,
          recipientId: userId,
          isRead: false,
        },
        data: { isRead: true },
      });

      // Get all messages for this order
      return await this.prisma.chatMessage.findMany({
        where: { orderId },
        orderBy: { createdAt: 'asc' },
        include: {
          sender: {
            select: { id: true, name: true }
          },
        },
      });
    } catch (error) {
      return this.handlePrismaError(error);
    }
  }

  async getUnreadCount(userId: number): Promise<number> {
    try {
      return await this.prisma.chatMessage.count({
        where: {
          recipientId: userId,
          isRead: false,
        },
      });
    } catch (error) {
      return this.handlePrismaError(error);
    }
  }

  async markMessagesAsRead(orderId: string, userId: number): Promise<void> {
    try {
      await this.prisma.chatMessage.updateMany({
        where: {
          orderId,
          recipientId: userId,
          isRead: false,
        },
        data: { isRead: true },
      });
    } catch (error) {
      return this.handlePrismaError(error);
    }
  }
}
