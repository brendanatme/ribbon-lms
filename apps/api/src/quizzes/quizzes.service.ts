import { Injectable } from '@nestjs/common';
import { QuestionType } from '@ribbon/shared';
import type {
  AttemptResult,
  QuizAttemptSummary,
  QuizAuthor,
  QuizResults,
  QuizTake,
  SubmitAttemptInput,
  UpsertQuizInput,
} from '@ribbon/shared';
import { PrismaService } from '@/prisma/prisma.service';
import { CoursesService } from '@/courses/courses.service';
import { notFound } from '@/common/exceptions';
import { toQuizAuthor, toQuizTake } from '@/common/mappers/quiz.mapper';
import { gradeQuestion } from './grading';

const QUIZ_INCLUDE = {
  questions: {
    orderBy: { order: 'asc' as const },
    include: { options: { orderBy: { order: 'asc' as const } } },
  },
};

@Injectable()
export class QuizzesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly courses: CoursesService,
  ) {}

  /* ----------------------------- Authoring ------------------------------ */

  async getForAuthor(teacherId: string, lessonId: string): Promise<QuizAuthor | null> {
    await this.courses.assertOwnsLesson(lessonId, teacherId);
    const quiz = await this.prisma.quiz.findUnique({
      where: { lessonId },
      include: QUIZ_INCLUDE,
    });
    return quiz ? toQuizAuthor(quiz) : null;
  }

  /**
   * Creates or replaces the quiz for a lesson. The questions are fully
   * rewritten: existing questions (and their options) are deleted and recreated
   * from the payload. The Quiz row itself is preserved so that historical
   * QuizAttempt scores survive a re-author; only per-answer detail tied to the
   * old questions is lost.
   */
  async upsertForLesson(
    teacherId: string,
    lessonId: string,
    dto: UpsertQuizInput,
  ): Promise<QuizAuthor> {
    await this.courses.assertOwnsLesson(lessonId, teacherId);

    await this.prisma.$transaction(async (tx) => {
      const quiz = await tx.quiz.upsert({
        where: { lessonId },
        update: { title: dto.title },
        create: { lessonId, title: dto.title },
      });

      await tx.question.deleteMany({ where: { quizId: quiz.id } });

      for (const q of dto.questions) {
        const isChoice =
          q.type === QuestionType.SINGLE_CHOICE || q.type === QuestionType.MULTIPLE_CHOICE;
        await tx.question.create({
          data: {
            quizId: quiz.id,
            type: q.type,
            prompt: q.prompt,
            order: q.order,
            points: q.points,
            correctText: q.type === QuestionType.TEXT ? (q.correctText ?? null) : null,
            correctNumber: q.type === QuestionType.NUMBER ? (q.correctNumber ?? null) : null,
            options: isChoice
              ? {
                  create: q.options.map((o) => ({
                    text: o.text,
                    isCorrect: o.isCorrect,
                    order: o.order,
                  })),
                }
              : undefined,
          },
        });
      }
    });

    const created = await this.getForAuthor(teacherId, lessonId);
    if (!created) throw notFound('Quiz not found');
    return created;
  }

  async remove(teacherId: string, lessonId: string) {
    await this.courses.assertOwnsLesson(lessonId, teacherId);
    await this.prisma.quiz.deleteMany({ where: { lessonId } });
    return { ok: true };
  }

  /* ------------------------------ Taking -------------------------------- */

  /** Loads a quiz for a student, asserting enrollment, with answers stripped. */
  async getToTake(studentId: string, lessonId: string): Promise<QuizTake> {
    await this.assertEnrolledInLessonCourse(studentId, lessonId);
    const quiz = await this.prisma.quiz.findUnique({
      where: { lessonId },
      include: QUIZ_INCLUDE,
    });
    if (!quiz) throw notFound('Quiz not found');
    return toQuizTake(quiz);
  }

  async submit(
    studentId: string,
    lessonId: string,
    dto: SubmitAttemptInput,
  ): Promise<AttemptResult> {
    await this.assertEnrolledInLessonCourse(studentId, lessonId);

    const quiz = await this.prisma.quiz.findUnique({
      where: { lessonId },
      include: QUIZ_INCLUDE,
    });
    if (!quiz) throw notFound('Quiz not found');

    const answersByQuestion = new Map(dto.answers.map((a) => [a.questionId, a]));

    let pointsEarned = 0;
    let pointsPossible = 0;
    const graded = quiz.questions.map((q) => {
      const submitted = answersByQuestion.get(q.id);
      const isCorrect = gradeQuestion(q, submitted);
      pointsPossible += q.points;
      if (isCorrect) pointsEarned += q.points;
      return {
        questionId: q.id,
        isCorrect,
        selectedOptionIds: submitted?.selectedOptionIds ?? [],
        textValue: submitted?.textValue ?? null,
        numberValue: submitted?.numberValue ?? null,
      };
    });

    const score = pointsPossible === 0 ? 0 : Math.round((pointsEarned / pointsPossible) * 100);

    const attempt = await this.prisma.quizAttempt.create({
      data: {
        quizId: quiz.id,
        studentId,
        score,
        pointsEarned,
        pointsPossible,
        answers: {
          create: graded.map((g) => ({
            questionId: g.questionId,
            isCorrect: g.isCorrect,
            selectedOptionIds: g.selectedOptionIds,
            textValue: g.textValue,
            numberValue: g.numberValue,
          })),
        },
      },
    });

    return {
      attemptId: attempt.id,
      quizId: quiz.id,
      score,
      pointsEarned,
      pointsPossible,
      submittedAt: attempt.submittedAt.toISOString(),
      answers: graded.map((g) => ({ questionId: g.questionId, isCorrect: g.isCorrect })),
    };
  }

  /** The student's best attempt at a lesson's quiz, or null if untaken. */
  async myBestResult(studentId: string, lessonId: string): Promise<QuizAttemptSummary | null> {
    const quiz = await this.prisma.quiz.findUnique({ where: { lessonId } });
    if (!quiz) return null;

    const attempts = await this.prisma.quizAttempt.findMany({
      where: { quizId: quiz.id, studentId },
      orderBy: { submittedAt: 'desc' },
    });
    const latest = attempts[0];
    if (!latest) return null;

    const bestScore = Math.max(...attempts.map((a) => a.score));
    return {
      quizId: quiz.id,
      lessonId,
      bestScore,
      attemptCount: attempts.length,
      lastAttemptAt: latest.submittedAt.toISOString(),
    };
  }

  /* ----------------------- Teacher results roster ----------------------- */

  async results(teacherId: string, lessonId: string): Promise<QuizResults> {
    await this.courses.assertOwnsLesson(lessonId, teacherId);

    const quiz = await this.prisma.quiz.findUnique({
      where: { lessonId },
      include: {
        attempts: { include: { student: { select: { id: true, name: true } } } },
        lesson: { select: { module: { select: { courseId: true } } } },
      },
    });
    if (!quiz) throw notFound('Quiz not found');

    // Every student enrolled in the course, so non-takers show up too.
    const enrollments = await this.prisma.enrollment.findMany({
      where: { courseId: quiz.lesson.module.courseId },
      include: { student: { select: { id: true, name: true } } },
    });

    const byStudent = new Map<
      string,
      { name: string; scores: number[]; lastAttemptAt: Date | null }
    >();
    for (const e of enrollments) {
      byStudent.set(e.student.id, { name: e.student.name, scores: [], lastAttemptAt: null });
    }
    for (const a of quiz.attempts) {
      const entry = byStudent.get(a.studentId) ?? {
        name: a.student.name,
        scores: [],
        lastAttemptAt: null,
      };
      entry.scores.push(a.score);
      if (!entry.lastAttemptAt || a.submittedAt > entry.lastAttemptAt) {
        entry.lastAttemptAt = a.submittedAt;
      }
      byStudent.set(a.studentId, entry);
    }

    const results = [...byStudent.entries()].map(([studentId, v]) => ({
      studentId,
      studentName: v.name,
      bestScore: v.scores.length === 0 ? null : Math.max(...v.scores),
      attemptCount: v.scores.length,
      lastAttemptAt: v.lastAttemptAt ? v.lastAttemptAt.toISOString() : null,
    }));

    return { quizId: quiz.id, lessonId, title: quiz.title, results };
  }

  /* ------------------------------ Helpers ------------------------------- */

  /** Asserts the student is enrolled in the (published) course owning the lesson. */
  private async assertEnrolledInLessonCourse(studentId: string, lessonId: string) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id: lessonId },
      include: { module: { include: { course: { select: { id: true, published: true } } } } },
    });
    if (!lesson || !lesson.module.course.published) throw notFound('Quiz not found');

    const enrollment = await this.prisma.enrollment.findUnique({
      where: {
        studentId_courseId: { studentId, courseId: lesson.module.course.id },
      },
    });
    if (!enrollment) throw notFound('Not enrolled in this course', 'NOT_ENROLLED');
    return enrollment;
  }
}
