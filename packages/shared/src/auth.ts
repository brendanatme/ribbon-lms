import { z } from 'zod';
import { roleSchema, userStatusSchema } from './enums.js';

export const signupSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email(),
  password: z.string().min(8).max(100),
});
export type SignupInput = z.infer<typeof signupSchema>;

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const userProfileSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  role: roleSchema,
  status: userStatusSchema,
  createdAt: z.string(),
});
export type UserProfile = z.infer<typeof userProfileSchema>;

export const authResponseSchema = z.object({
  accessToken: z.string(),
  user: userProfileSchema,
});
export type AuthResponse = z.infer<typeof authResponseSchema>;
