import request from 'supertest';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import {
  createTestApp,
  cleanupTestApp,
  makeUser,
  auth,
  type TestApp,
  type TestUser,
} from './helpers';

/**
 * Integration test: a student enrolls in a published course, completes a
 * lesson, and progress is reflected. Also verifies analytics aggregate the
 * completion, and that completing without enrollment is rejected.
 */
describe('Student enroll + completion flow', () => {
  let ctx: TestApp;
  let teacher: TestUser;
  let courseId: string;
  let lessonIds: string[];

  beforeAll(async () => {
    ctx = await createTestApp();
    teacher = await makeUser(ctx, 'TEACHER');
    const server = ctx.app.getHttpServer();

    // Build a published course with two lessons.
    const course = await request(server)
      .post('/api/courses')
      .set(auth(teacher.token))
      .send({ title: 'Progress Course', description: 'For progress testing' });
    courseId = course.body.id;

    const mod = await request(server)
      .post(`/api/courses/${courseId}/modules`)
      .set(auth(teacher.token))
      .send({ title: 'Module 1', order: 0 });

    const l1 = await request(server)
      .post(`/api/modules/${mod.body.id}/lessons`)
      .set(auth(teacher.token))
      .send({ title: 'Lesson 1', content: '', order: 0, durationMin: 5 });
    const l2 = await request(server)
      .post(`/api/modules/${mod.body.id}/lessons`)
      .set(auth(teacher.token))
      .send({ title: 'Lesson 2', content: '', order: 1, durationMin: 5 });
    lessonIds = [l1.body.id, l2.body.id];

    await request(server).patch(`/api/courses/${courseId}/publish`).set(auth(teacher.token));
  });

  afterAll(async () => {
    await cleanupTestApp(ctx);
  });

  it('enrolls, completes one lesson, and reports 50% progress', async () => {
    const server = ctx.app.getHttpServer();
    const student = await makeUser(ctx, 'STUDENT');

    await request(server)
      .post('/api/enrollments')
      .set(auth(student.token))
      .send({ courseId })
      .expect(201);

    // Initial progress is 0%.
    const before = await request(server)
      .get('/api/enrollments')
      .set(auth(student.token))
      .expect(200);
    const enrBefore = before.body.find((e: { course: { id: string } }) => e.course.id === courseId);
    expect(enrBefore.percentComplete).toBe(0);
    expect(enrBefore.totalLessons).toBe(2);

    // Complete the first of two lessons.
    await request(server)
      .post(`/api/lessons/${lessonIds[0]}/complete`)
      .set(auth(student.token))
      .expect(201);

    const after = await request(server)
      .get('/api/enrollments')
      .set(auth(student.token))
      .expect(200);
    const enrAfter = after.body.find((e: { course: { id: string } }) => e.course.id === courseId);
    expect(enrAfter.completedCount).toBe(1);
    expect(enrAfter.percentComplete).toBe(50);
  });

  it('is idempotent when completing the same lesson twice', async () => {
    const server = ctx.app.getHttpServer();
    const student = await makeUser(ctx, 'STUDENT');

    await request(server).post('/api/enrollments').set(auth(student.token)).send({ courseId });
    await request(server)
      .post(`/api/lessons/${lessonIds[0]}/complete`)
      .set(auth(student.token))
      .expect(201);
    await request(server)
      .post(`/api/lessons/${lessonIds[0]}/complete`)
      .set(auth(student.token))
      .expect(201);

    const res = await request(server).get('/api/enrollments').set(auth(student.token));
    const enr = res.body.find((e: { course: { id: string } }) => e.course.id === courseId);
    expect(enr.completedCount).toBe(1);
  });

  it('rejects completing a lesson without enrollment', async () => {
    const server = ctx.app.getHttpServer();
    const student = await makeUser(ctx, 'STUDENT');

    await request(server)
      .post(`/api/lessons/${lessonIds[0]}/complete`)
      .set(auth(student.token))
      .expect(404);
  });

  it('reflects completions in teacher analytics', async () => {
    const server = ctx.app.getHttpServer();
    const student = await makeUser(ctx, 'STUDENT');

    await request(server).post('/api/enrollments').set(auth(student.token)).send({ courseId });
    await request(server).post(`/api/lessons/${lessonIds[0]}/complete`).set(auth(student.token));

    const analytics = await request(server)
      .get(`/api/analytics/courses/${courseId}`)
      .set(auth(teacher.token))
      .expect(200);

    expect(analytics.body.enrollmentCount).toBeGreaterThanOrEqual(1);
    const lesson1 = analytics.body.lessonCompletion.find(
      (l: { lessonId: string }) => l.lessonId === lessonIds[0],
    );
    expect(lesson1.completedCount).toBeGreaterThanOrEqual(1);
  });
});
