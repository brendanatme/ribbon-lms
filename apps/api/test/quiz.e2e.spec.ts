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
 * Integration test for the quiz flow: a teacher authors a quiz on a lesson, a
 * student takes it, the attempt is auto-graded, and the results surface to both
 * the student (best score) and the teacher (roster + analytics). Also verifies
 * the take endpoint never leaks correct answers.
 */
describe('Quiz authoring + taking flow', () => {
  let ctx: TestApp;
  let teacher: TestUser;
  let courseId: string;
  let lessonId: string;
  let optionIds: string[];

  beforeAll(async () => {
    ctx = await createTestApp();
    teacher = await makeUser(ctx, 'TEACHER');
    const server = ctx.app.getHttpServer();

    const course = await request(server)
      .post('/api/courses')
      .set(auth(teacher.token))
      .send({ title: 'Quiz Course', description: 'For quiz testing' });
    courseId = course.body.id;

    const mod = await request(server)
      .post(`/api/courses/${courseId}/modules`)
      .set(auth(teacher.token))
      .send({ title: 'Module 1', order: 0 });

    const lesson = await request(server)
      .post(`/api/modules/${mod.body.id}/lessons`)
      .set(auth(teacher.token))
      .send({ title: 'Lesson 1', content: '', order: 0, durationMin: 5 });
    lessonId = lesson.body.id;

    await request(server).patch(`/api/courses/${courseId}/publish`).set(auth(teacher.token));
  });

  afterAll(async () => {
    await cleanupTestApp(ctx);
  });

  it('lets a teacher author a quiz and reflects it on the course detail', async () => {
    const server = ctx.app.getHttpServer();

    const quiz = await request(server)
      .put(`/api/lessons/${lessonId}/quiz`)
      .set(auth(teacher.token))
      .send({
        title: 'Basics',
        questions: [
          {
            type: 'SINGLE_CHOICE',
            prompt: '2 + 2?',
            order: 0,
            points: 2,
            options: [
              { text: '3', isCorrect: false, order: 0 },
              { text: '4', isCorrect: true, order: 1 },
            ],
          },
          {
            type: 'NUMBER',
            prompt: 'Square root of 9?',
            order: 1,
            points: 1,
            options: [],
            correctNumber: 3,
          },
        ],
      })
      .expect(200);

    expect(quiz.body.questions).toHaveLength(2);
    optionIds = quiz.body.questions[0].options.map((o: { id: string }) => o.id);

    const detail = await request(server)
      .get(`/api/courses/${courseId}`)
      .set(auth(teacher.token))
      .expect(200);
    const detailLesson = detail.body.modules[0].lessons.find(
      (l: { id: string }) => l.id === lessonId,
    );
    expect(detailLesson.hasQuiz).toBe(true);
  });

  it('rejects an invalid quiz (single-choice with no correct option)', async () => {
    const server = ctx.app.getHttpServer();
    await request(server)
      .put(`/api/lessons/${lessonId}/quiz`)
      .set(auth(teacher.token))
      .send({
        questions: [
          {
            type: 'SINGLE_CHOICE',
            prompt: 'Bad',
            order: 0,
            points: 1,
            options: [
              { text: 'a', isCorrect: false, order: 0 },
              { text: 'b', isCorrect: false, order: 1 },
            ],
          },
        ],
      })
      .expect(400);
  });

  it('does not leak correct answers in the student take view', async () => {
    const server = ctx.app.getHttpServer();
    const student = await makeUser(ctx, 'STUDENT');
    await request(server).post('/api/enrollments').set(auth(student.token)).send({ courseId });

    const take = await request(server)
      .get(`/api/lessons/${lessonId}/quiz/take`)
      .set(auth(student.token))
      .expect(200);

    const serialized = JSON.stringify(take.body);
    expect(serialized).not.toContain('isCorrect');
    expect(serialized).not.toContain('correctNumber');
    expect(serialized).not.toContain('correctText');
  });

  it('auto-grades a submitted attempt and records the best score', async () => {
    const server = ctx.app.getHttpServer();
    const student = await makeUser(ctx, 'STUDENT');
    await request(server).post('/api/enrollments').set(auth(student.token)).send({ courseId });

    const take = await request(server)
      .get(`/api/lessons/${lessonId}/quiz/take`)
      .set(auth(student.token))
      .expect(200);
    const q1 = take.body.questions.find((q: { type: string }) => q.type === 'SINGLE_CHOICE');
    const q2 = take.body.questions.find((q: { type: string }) => q.type === 'NUMBER');
    const correctOptionId = optionIds[1]; // '4' is the correct option

    // Answer the choice question correctly (2 pts) and the number wrong (0 pts).
    const result = await request(server)
      .post(`/api/lessons/${lessonId}/quiz/attempts`)
      .set(auth(student.token))
      .send({
        answers: [
          { questionId: q1.id, selectedOptionIds: [correctOptionId] },
          { questionId: q2.id, selectedOptionIds: [], numberValue: 99 },
        ],
      })
      .expect(201);

    expect(result.body.pointsEarned).toBe(2);
    expect(result.body.pointsPossible).toBe(3);
    expect(result.body.score).toBe(67);

    const mine = await request(server)
      .get(`/api/lessons/${lessonId}/quiz/my-result`)
      .set(auth(student.token))
      .expect(200);
    expect(mine.body.bestScore).toBe(67);
    expect(mine.body.attemptCount).toBe(1);
  });

  it('surfaces quiz scores in teacher results and analytics', async () => {
    const server = ctx.app.getHttpServer();

    const results = await request(server)
      .get(`/api/lessons/${lessonId}/quiz/results`)
      .set(auth(teacher.token))
      .expect(200);
    expect(results.body.results.length).toBeGreaterThanOrEqual(1);
    const withScore = results.body.results.find(
      (r: { bestScore: number | null }) => r.bestScore != null,
    );
    expect(withScore.bestScore).toBe(67);

    const analytics = await request(server)
      .get(`/api/analytics/courses/${courseId}`)
      .set(auth(teacher.token))
      .expect(200);
    expect(analytics.body.averageQuizScore).toBeGreaterThan(0);
    expect(analytics.body.quizStats.length).toBeGreaterThanOrEqual(1);
  });

  it('forbids a student from reading the author view', async () => {
    const server = ctx.app.getHttpServer();
    const student = await makeUser(ctx, 'STUDENT');
    await request(server).get(`/api/lessons/${lessonId}/quiz`).set(auth(student.token)).expect(403);
  });
});
