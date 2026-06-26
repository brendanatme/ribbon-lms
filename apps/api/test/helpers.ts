import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '@/app.module.js';
import { AllExceptionsFilter } from '@/common/filters/all-exceptions.filter.js';
import { PrismaService } from '@/prisma/prisma.service.js';

export interface TestApp {
  app: INestApplication;
  prisma: PrismaService;
  /** IDs of every user created via makeUser, for teardown. */
  createdUserIds: string[];
}

export async function createTestApp(): Promise<TestApp> {
  const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
  const app = moduleRef.createNestApplication();
  app.setGlobalPrefix('api');
  app.useGlobalFilters(new AllExceptionsFilter());
  await app.init();
  const prisma = app.get(PrismaService);
  return { app, prisma, createdUserIds: [] };
}

/**
 * Deletes every user created by this suite, then closes the app. Cascade
 * deletes (User -> Course -> Module -> Lesson, User -> Enrollment ->
 * LessonProgress) remove all dependent rows, so the database is left clean.
 * Safe to call in afterAll even if some tests failed.
 */
export async function cleanupTestApp(ctx: TestApp | undefined): Promise<void> {
  if (!ctx) return;
  try {
    if (ctx.createdUserIds.length > 0) {
      await ctx.prisma.user.deleteMany({ where: { id: { in: ctx.createdUserIds } } });
    }
  } finally {
    await ctx.app?.close();
  }
}

export interface TestUser {
  token: string;
  id: string;
  email: string;
}

/**
 * Signs up a fresh user (always STUDENT by default), then optionally
 * promotes them to the requested role directly via Prisma so tests can
 * exercise teacher/admin endpoints without depending on seed data.
 */
export async function makeUser(
  ctx: TestApp,
  role: 'ADMIN' | 'TEACHER' | 'STUDENT' = 'STUDENT',
): Promise<TestUser> {
  const { app, prisma } = ctx;
  const email = `test+${role}-${Date.now()}-${Math.random().toString(36).slice(2)}@ribbon.dev`;
  const res = await request(app.getHttpServer())
    .post('/api/auth/signup')
    .send({ name: `Test ${role}`, email, password: 'Password123!' });

  const id = res.body.user.id as string;
  ctx.createdUserIds.push(id);

  if (role !== 'STUDENT') {
    await prisma.user.update({ where: { id }, data: { role } });
    // Re-login so the JWT carries the updated role claim.
    const relog = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ email, password: 'Password123!' });
    return { token: relog.body.accessToken, id, email };
  }

  return { token: res.body.accessToken, id, email };
}

export const auth = (token: string) => ({ Authorization: `Bearer ${token}` });
