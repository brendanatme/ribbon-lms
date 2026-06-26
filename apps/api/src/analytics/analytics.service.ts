import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import type { CourseAnalytics } from '@ribbon/shared';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async courseAnalytics(teacherId: string, courseId: string): Promise<CourseAnalytics> {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
      include: {
        modules: { include: { lessons: { select: { id: true, title: true } } } },
        enrollments: { include: { progress: { select: { lessonId: true } } } },
      },
    });
    if (!course) throw new NotFoundException({ message: 'Course not found', code: 'NOT_FOUND' });
    if (course.teacherId !== teacherId) {
      throw new ForbiddenException({ message: 'Not your course', code: 'FORBIDDEN' });
    }

    const lessons = course.modules.flatMap((m) => m.lessons);
    const totalLessons = lessons.length;
    const enrollmentCount = course.enrollments.length;

    // Per-lesson completion counts across all enrollments.
    const lessonCompletion = lessons.map((lesson) => {
      const completedCount = course.enrollments.filter((e) =>
        e.progress.some((p) => p.lessonId === lesson.id),
      ).length;
      return { lessonId: lesson.id, title: lesson.title, completedCount };
    });

    // Average progress across enrolled students, and fully-completed rate.
    let progressSum = 0;
    let fullyCompleted = 0;
    for (const e of course.enrollments) {
      const done = e.progress.length;
      const pct = totalLessons === 0 ? 0 : done / totalLessons;
      progressSum += pct;
      if (totalLessons > 0 && done >= totalLessons) fullyCompleted += 1;
    }

    return {
      courseId: course.id,
      title: course.title,
      enrollmentCount,
      completionRate:
        enrollmentCount === 0 ? 0 : Math.round((fullyCompleted / enrollmentCount) * 100),
      averageProgress:
        enrollmentCount === 0 ? 0 : Math.round((progressSum / enrollmentCount) * 100),
      lessonCompletion,
    };
  }
}
