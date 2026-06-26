import { z } from 'zod';

export const Role = {
  ADMIN: 'ADMIN',
  TEACHER: 'TEACHER',
  STUDENT: 'STUDENT',
} as const;
export type Role = (typeof Role)[keyof typeof Role];
export const roleSchema = z.nativeEnum(Role);

export const UserStatus = {
  ACTIVE: 'ACTIVE',
  DISABLED: 'DISABLED',
} as const;
export type UserStatus = (typeof UserStatus)[keyof typeof UserStatus];
export const userStatusSchema = z.nativeEnum(UserStatus);

export const QuestionType = {
  SINGLE_CHOICE: 'SINGLE_CHOICE',
  MULTIPLE_CHOICE: 'MULTIPLE_CHOICE',
  TEXT: 'TEXT',
  NUMBER: 'NUMBER',
} as const;
export type QuestionType = (typeof QuestionType)[keyof typeof QuestionType];
export const questionTypeSchema = z.nativeEnum(QuestionType);

export const ROLE_HOME_PATH: Record<Role, string> = {
  ADMIN: '/admin',
  TEACHER: '/teacher',
  STUDENT: '/student',
};
