import request from 'supertest';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import {
  createTestApp,
  cleanupTestApp,
  makeUser,
  auth,
  type TestApp,
  type TestUser,
} from './helpers.js';

/**
 * Integration test: a teacher creates a course, adds a module + lesson,
 * publishes it, and it then appears in the public catalog. Also verifies
 * ownership isolation between two teachers.
 */
describe('Teacher course + publish flow', () => {
  let ctx: TestApp;
  let teacher: TestUser;

  beforeAll(async () => {
    ctx = await createTestApp();
    teacher = await makeUser(ctx, 'TEACHER');
  });

  afterAll(async () => {
    await cleanupTestApp(ctx);
  });

  it('creates, builds, publishes a course and surfaces it in the catalog', async () => {
    const server = ctx.app.getHttpServer();

    // Create course (starts as a draft).
    const created = await request(server)
      .post('/api/courses')
      .set(auth(teacher.token))
      .send({ title: 'Test Course', description: 'A course for testing' })
      .expect(201);
    const courseId = created.body.id as string;
    expect(created.body.published).toBe(false);

    // Add a module, then a lesson to it.
    const mod = await request(server)
      .post(`/api/courses/${courseId}/modules`)
      .set(auth(teacher.token))
      .send({ title: 'Module 1', order: 0 })
      .expect(201);

    await request(server)
      .post(`/api/modules/${mod.body.id}/lessons`)
      .set(auth(teacher.token))
      .send({ title: 'Lesson 1', content: 'Hello', order: 0, durationMin: 5 })
      .expect(201);

    // Not in catalog while it's a draft.
    const draftCatalog = await request(server)
      .get('/api/catalog')
      .set(auth(teacher.token))
      .expect(200);
    expect(draftCatalog.body.some((c: { id: string }) => c.id === courseId)).toBe(false);

    // Publish.
    const published = await request(server)
      .patch(`/api/courses/${courseId}/publish`)
      .set(auth(teacher.token))
      .expect(200);
    expect(published.body.published).toBe(true);

    // Now visible in the catalog with the lesson counted in detail.
    const catalog = await request(server).get('/api/catalog').set(auth(teacher.token)).expect(200);
    expect(catalog.body.some((c: { id: string }) => c.id === courseId)).toBe(true);

    const detail = await request(server)
      .get(`/api/catalog/${courseId}`)
      .set(auth(teacher.token))
      .expect(200);
    expect(detail.body.lessonCount).toBe(1);
  });

  it("prevents a teacher from modifying another teacher's course", async () => {
    const server = ctx.app.getHttpServer();
    const other = await makeUser(ctx, 'TEACHER');

    const created = await request(server)
      .post('/api/courses')
      .set(auth(teacher.token))
      .send({ title: 'Owned Course', description: '' })
      .expect(201);

    await request(server)
      .patch(`/api/courses/${created.body.id}/publish`)
      .set(auth(other.token))
      .expect(403);
  });

  it('rejects course creation by a student', async () => {
    const server = ctx.app.getHttpServer();
    const student = await makeUser(ctx, 'STUDENT');

    await request(server)
      .post('/api/courses')
      .set(auth(student.token))
      .send({ title: 'Nope', description: '' })
      .expect(403);
  });
});
