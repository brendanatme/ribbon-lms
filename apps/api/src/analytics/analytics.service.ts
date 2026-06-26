import { Injectable } from '@nestjs/common';
import type { CourseAnalytics } from '@ribbon/shared';
import { PrismaService } from '@/prisma/prisma.service';
import { forbidden, notFound } from '@/common/exceptions';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async courseAnalytics(teacherId: string, courseId: string): Promise<CourseAnalytics> {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
      include: {
        modules: {
          include: {
            lessons: {
              select: {
                id: true,
                title: true,
                quiz: {
                  select: {
                    attempts: { select: { studentId: true, score: true } },
                  },
                },
              },
            },
          },
        },
        enrollments: { include: { progress: { select: { lessonId: true } } } },
      },
    });
    if (!course) throw notFound('Course not found');
    if (course.teacherId !== teacherId) throw forbidden('Not your course');

    const lessons = course.modules.flatMap((m) => m.lessons);
    const totalLessons = lessons.length;
    const enrollmentCount = course.enrollments.length;

    // Tally completions per lesson in a single pass over all progress rows.
    // (Progress is unique per enrollment+lesson, so a row count is a learner count.)
    const completionByLesson = new Map<string, number>();
    for (const e of course.enrollments) {
      for (const p of e.progress) {
        completionByLesson.set(p.lessonId, (completionByLesson.get(p.lessonId) ?? 0) + 1);
      }
    }
    const lessonCompletion = lessons.map((lesson) => ({
      lessonId: lesson.id,
      title: lesson.title,
      completedCount: completionByLesson.get(lesson.id) ?? 0,
    }));

    // Average progress across enrolled students, and fully-completed rate.
    let progressSum = 0;
    let fullyCompleted = 0;
    for (const e of course.enrollments) {
      const done = e.progress.length;
      const pct = totalLessons === 0 ? 0 : done / totalLessons;
      progressSum += pct;
      if (totalLessons > 0 && done >= totalLessons) fullyCompleted += 1;
    }

    // Quiz grades: per quiz, take each student's best score, then average those.
    // `allBestScores` pools every per-student best across quizzes for the course KPI.
    const quizStats: {
      lessonId: string;
      title: string;
      averageScore: number;
      attemptCount: number;
    }[] = [];
    const allBestScores: number[] = [];
    for (const lesson of lessons) {
      if (!lesson.quiz) continue;
      const attempts = lesson.quiz.attempts;
      const bestByStudent = new Map<string, number>();
      for (const a of attempts) {
        bestByStudent.set(a.studentId, Math.max(bestByStudent.get(a.studentId) ?? 0, a.score));
      }
      const bests = [...bestByStudent.values()];
      allBestScores.push(...bests);
      quizStats.push({
        lessonId: lesson.id,
        title: lesson.title,
        averageScore: bests.length === 0 ? 0 : Math.round(average(bests)),
        attemptCount: attempts.length,
      });
    }
    const averageQuizScore = allBestScores.length === 0 ? 0 : Math.round(average(allBestScores));

    return {
      courseId: course.id,
      title: course.title,
      enrollmentCount,
      completionRate:
        enrollmentCount === 0 ? 0 : Math.round((fullyCompleted / enrollmentCount) * 100),
      averageProgress:
        enrollmentCount === 0 ? 0 : Math.round((progressSum / enrollmentCount) * 100),
      averageQuizScore,
      lessonCompletion,
      quizStats,
    };
  }
}

const average = (xs: number[]) => xs.reduce((sum, x) => sum + x, 0) / xs.length;
