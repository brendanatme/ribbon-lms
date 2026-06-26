import { z } from 'zod';
import { roleSchema, userStatusSchema } from './enums.js';
import { userProfileSchema } from './auth.js';

export const updateRoleSchema = z.object({
  role: roleSchema,
});
export type UpdateRoleInput = z.infer<typeof updateRoleSchema>;

export const updateStatusSchema = z.object({
  status: userStatusSchema,
});
export type UpdateStatusInput = z.infer<typeof updateStatusSchema>;

export const listUsersQuerySchema = z.object({
  search: z.string().optional(),
  role: roleSchema.optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});
export type ListUsersQuery = z.infer<typeof listUsersQuerySchema>;

export const paginatedUsersSchema = z.object({
  items: z.array(userProfileSchema),
  total: z.number(),
  page: z.number(),
  pageSize: z.number(),
});
export type PaginatedUsers = z.infer<typeof paginatedUsersSchema>;
