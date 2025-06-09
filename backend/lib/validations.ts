
import { z } from 'zod';

// User validations
export const CreateUserSchema = z.object({
  phone: z.string().min(10).max(15).optional(),
  email: z.string().email().optional(),
  name: z.string().min(2).max(255).optional(),
  password: z.string().min(6).optional(),
  role: z.enum(['customer', 'shop_owner', 'admin']).default('customer'),
});

export const UpdateUserSchema = z.object({
  name: z.string().min(2).max(255).optional(),
  email: z.string().email().optional(),
});

export const LoginSchema = z.object({
  phone: z.string().min(10).max(15).optional(),
  email: z.string().email().optional(),
  password: z.string().optional(),
}).refine(data => data.phone || data.email, {
  message: "Either phone or email is required",
});

// Shop validations
export const CreateShopSchema = z.object({
  name: z.string().min(2).max(255),
  address: z.string().min(10),
  phone: z.string().min(10).max(20),
  email: z.string().email().optional(),
  openingTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/).default('09:00:00'),
  closingTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/).default('18:00:00'),
});

export const UpdateShopSchema = CreateShopSchema.partial();

// Order validations
export const CreateOrderSchema = z.object({
  shopId: z.number().int().positive(),
  orderType: z.enum(['walk-in', 'uploaded-files']),
  description: z.string().min(10),
  instructions: z.string().optional(),
  services: z.array(z.string()).default([]),
  pages: z.number().int().positive().optional(),
  copies: z.number().int().positive().default(1),
  paperType: z.string().optional(),
  binding: z.string().optional(),
  color: z.boolean().default(false),
});

export const UpdateOrderSchema = z.object({
  status: z.enum(['new', 'confirmed', 'processing', 'ready', 'completed', 'cancelled']).optional(),
  isUrgent: z.boolean().optional(),
  instructions: z.string().optional(),
  estimatedCompletion: z.string().datetime().optional(),
});

// Chat validations
export const SendMessageSchema = z.object({
  orderId: z.string(),
  message: z.string().min(1).max(1000),
  recipientId: z.number().int().positive(),
});

export const QuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  search: z.string().optional(),
  status: z.enum(['new', 'confirmed', 'processing', 'ready', 'completed', 'cancelled']).optional(),
  orderType: z.enum(['walk-in', 'uploaded-files']).optional(),
  urgent: z.coerce.boolean().optional(),
});
