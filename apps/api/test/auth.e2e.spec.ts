import request from 'supertest';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createTestApp, cleanupTestApp, auth, type TestApp } from './helpers.js';

/**
 * Integration test: signup -> /auth/me happy path, plus RBAC negative cases.
 * Requires a reachable test database (set DATABASE_URL before running).
 */
describe('Auth flow', () => {
  let ctx: TestApp;

  beforeAll(async () => {
    ctx = await createTestApp();
  });

  afterAll(async () => {
    await cleanupTestApp(ctx);
  });

  it('signs up a new student and returns a token', async () => {
    const email = `test+${Date.now()}@ribbon.dev`;
    const res = await request(ctx.app.getHttpServer())
      .post('/api/auth/signup')
      .send({ name: 'Test User', email, password: 'Password123!' })
      .expect(201);

    expect(res.body.accessToken).toBeTruthy();
    expect(res.body.user.role).toBe('STUDENT');
    ctx.createdUserIds.push(res.body.user.id);

    const me = await request(ctx.app.getHttpServer())
      .get('/api/auth/me')
      .set(auth(res.body.accessToken))
      .expect(200);
    expect(me.body.email).toBe(email);
  });

  it('rejects /users for non-admin', async () => {
    const email = `test+${Date.now()}@ribbon.dev`;
    const signup = await request(ctx.app.getHttpServer())
      .post('/api/auth/signup')
      .send({ name: 'Test User', email, password: 'Password123!' });
    ctx.createdUserIds.push(signup.body.user.id);

    await request(ctx.app.getHttpServer())
      .get('/api/users')
      .set(auth(signup.body.accessToken))
      .expect(403);
  });

  it('rejects unauthenticated access to a protected route', async () => {
    await request(ctx.app.getHttpServer()).get('/api/auth/me').expect(401);
  });
});
