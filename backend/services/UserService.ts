
import { Role, User } from '@prisma/client';
import bcrypt from 'bcrypt';
import { BaseService } from './BaseService';
import { CreateUserSchema, UpdateUserSchema } from '../lib/validations';

export class UserService extends BaseService {
  async createUser(data: {
    phone?: string;
    email?: string;
    name?: string;
    password?: string;
    role?: Role;
  }): Promise<Omit<User, 'passwordHash'>> {
    try {
      const validatedData = CreateUserSchema.parse(data);
      
      let passwordHash: string | undefined;
      if (validatedData.password) {
        passwordHash = await bcrypt.hash(validatedData.password, 10);
      }

      const user = await this.prisma.user.create({
        data: {
          phone: validatedData.phone,
          email: validatedData.email,
          name: validatedData.name,
          passwordHash,
          role: validatedData.role as Role,
        },
      });

      const { passwordHash: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      return this.handlePrismaError(error);
    }
  }

  async findUserByPhone(phone: string): Promise<User | null> {
    try {
      return await this.prisma.user.findUnique({
        where: { phone, isActive: true },
        include: {
          ownedShops: {
            where: { isActive: true },
            select: { id: true, name: true }
          }
        }
      });
    } catch (error) {
      return this.handlePrismaError(error);
    }
  }

  async findUserByEmail(email: string): Promise<User | null> {
    try {
      return await this.prisma.user.findUnique({
        where: { email, isActive: true },
        include: {
          ownedShops: {
            where: { isActive: true },
            select: { id: true, name: true }
          }
        }
      });
    } catch (error) {
      return this.handlePrismaError(error);
    }
  }

  async findUserById(id: number): Promise<Omit<User, 'passwordHash'> | null> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id, isActive: true },
        include: {
          ownedShops: {
            where: { isActive: true },
            select: { id: true, name: true }
          }
        }
      });

      if (!user) return null;

      const { passwordHash: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      return this.handlePrismaError(error);
    }
  }

  async updateUser(id: number, data: { name?: string; email?: string }): Promise<Omit<User, 'passwordHash'>> {
    try {
      const validatedData = UpdateUserSchema.parse(data);
      
      const user = await this.prisma.user.update({
        where: { id },
        data: validatedData,
      });

      const { passwordHash: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      return this.handlePrismaError(error);
    }
  }

  async verifyPassword(user: User, password: string): Promise<boolean> {
    if (!user.passwordHash) return false;
    return bcrypt.compare(password, user.passwordHash);
  }

  async changePassword(id: number, currentPassword: string, newPassword: string): Promise<void> {
    try {
      const user = await this.prisma.user.findUnique({ where: { id } });
      if (!user) throw new Error('User not found');

      if (user.passwordHash) {
        const isValidPassword = await bcrypt.compare(currentPassword, user.passwordHash);
        if (!isValidPassword) throw new Error('Current password is incorrect');
      }

      const passwordHash = await bcrypt.hash(newPassword, 10);
      await this.prisma.user.update({
        where: { id },
        data: { passwordHash },
      });
    } catch (error) {
      return this.handlePrismaError(error);
    }
  }

  async getAllUsers(page: number = 1, limit: number = 10, search?: string) {
    try {
      const { skip, take } = this.getPagination(page, limit);
      
      const where = search ? {
        OR: [
          { name: { contains: search, mode: 'insensitive' as const } },
          { email: { contains: search, mode: 'insensitive' as const } },
          { phone: { contains: search, mode: 'insensitive' as const } },
        ],
      } : {};

      const [users, total] = await Promise.all([
        this.prisma.user.findMany({
          where,
          skip,
          take,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            phone: true,
            email: true,
            name: true,
            role: true,
            isActive: true,
            createdAt: true,
            ownedShops: {
              select: { id: true, name: true }
            }
          },
        }),
        this.prisma.user.count({ where }),
      ]);

      return {
        users,
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

  async deactivateUser(id: number): Promise<void> {
    try {
      await this.prisma.user.update({
        where: { id },
        data: { isActive: false },
      });
    } catch (error) {
      return this.handlePrismaError(error);
    }
  }
}
