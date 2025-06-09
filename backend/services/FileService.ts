
import { OrderFile } from '@prisma/client';
import { BaseService } from './BaseService';
import fs from 'fs';
import path from 'path';

export class FileService extends BaseService {
  async uploadFiles(orderId: string, files: Express.Multer.File[], uploadedBy?: number): Promise<OrderFile[]> {
    try {
      const filePromises = files.map(file => 
        this.prisma.orderFile.create({
          data: {
            orderId,
            originalName: file.originalname,
            filePath: file.path,
            mimeType: file.mimetype,
            fileSize: BigInt(file.size),
            uploadedBy,
          },
        })
      );

      return await Promise.all(filePromises);
    } catch (error) {
      return this.handlePrismaError(error);
    }
  }

  async getOrderFiles(orderId: string, userId?: number, userRole?: string): Promise<OrderFile[]> {
    try {
      // Verify user has access to this order
      if (userId && userRole) {
        const order = await this.prisma.order.findFirst({
          where: {
            id: orderId,
            ...(userRole === 'customer' ? { customerId: userId } : {}),
            ...(userRole === 'shop_owner' ? { shop: { ownerId: userId } } : {}),
          },
        });

        if (!order) throw new Error('Order not found or access denied');
      }

      return await this.prisma.orderFile.findMany({
        where: { orderId },
        orderBy: { uploadedAt: 'desc' },
        include: {
          uploader: {
            select: { id: true, name: true }
          }
        },
      });
    } catch (error) {
      return this.handlePrismaError(error);
    }
  }

  async getFileById(fileId: number, userId?: number, userRole?: string): Promise<OrderFile | null> {
    try {
      const file = await this.prisma.orderFile.findUnique({
        where: { id: fileId },
        include: {
          order: {
            include: {
              customer: true,
              shop: { include: { owner: true } }
            }
          }
        },
      });

      if (!file) return null;

      // Check user permissions
      if (userId && userRole) {
        const hasPermission = 
          file.order.customerId === userId ||
          (userRole === 'shop_owner' && file.order.shop.ownerId === userId) ||
          userRole === 'admin';

        if (!hasPermission) throw new Error('Access denied');
      }

      return file;
    } catch (error) {
      return this.handlePrismaError(error);
    }
  }

  async deleteFile(fileId: number, userId?: number, userRole?: string): Promise<void> {
    try {
      const file = await this.getFileById(fileId, userId, userRole);
      if (!file) throw new Error('File not found');

      // Delete file from disk
      if (fs.existsSync(file.filePath)) {
        fs.unlinkSync(file.filePath);
      }

      // Delete from database
      await this.prisma.orderFile.delete({ where: { id: fileId } });
    } catch (error) {
      return this.handlePrismaError(error);
    }
  }

  async cleanupOrphanedFiles(): Promise<void> {
    try {
      // Find files older than 24 hours with no associated order
      const orphanedFiles = await this.prisma.orderFile.findMany({
        where: {
          uploadedAt: {
            lt: new Date(Date.now() - 24 * 60 * 60 * 1000),
          },
          order: null,
        },
      });

      for (const file of orphanedFiles) {
        if (fs.existsSync(file.filePath)) {
          fs.unlinkSync(file.filePath);
        }
        await this.prisma.orderFile.delete({ where: { id: file.id } });
      }

      console.log(`Cleaned up ${orphanedFiles.length} orphaned files`);
    } catch (error) {
      console.error('Error cleaning up orphaned files:', error);
    }
  }
}
