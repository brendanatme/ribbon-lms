import { Injectable } from '@nestjs/common';
import type { CourseDetail, EnrollmentProgress } from '@ribbon/shared';
import { PrismaService } from '@/prisma/prisma.service';
import { CoursesService } from '@/courses/courses.service';
import { conflict, notFound } from '@/common/exceptions';
import { toCourse } from '@/common/mappers/course.mapper';

@Injectable()
export class EnrollmentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly courses: CoursesService,
  ) {}

  /** Loads a published course or throws 404 — the catalog gate for students. */
  private async getPublishedCourseOrThrow(courseId: string) {
    const course = await this.prisma.course.findFirst({
      where: { id: courseId, published: true },
    });
    if (!course) throw notFound('Course not available');
    return course;
  }

  async catalog() {
    const rows = await this.prisma.course.findMany({
      where: { published: true },
      include: { teacher: true, _count: { select: { enrollments: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return rows.map((c) => ({ ...toCourse(c), enrollmentCount: c._count.enrollments }));
  }

  async catalogDetail(courseId: string): Promise<CourseDetail> {
    await this.getPublishedCourseOrThrow(courseId);
    return this.courses.detail(courseId);
  }

  async enroll(studentId: string, courseId: string) {
    await this.getPublishedCourseOrThrow(courseId);

    const existing = await this.prisma.enrollment.findUnique({
      where: { studentId_courseId: { studentId, courseId } },
    });
    if (existing) {
      throw conflict('Already enrolled', 'ALREADY_ENROLLED');
    }
    return this.prisma.enrollment.create({ data: { studentId, courseId } });
  }

  async completeLesson(studentId: string, lessonId: string) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id: lessonId },
      include: { module: true },
    });
    if (!lesson) throw notFound('Lesson not found');

    const enrollment = await this.prisma.enrollment.findUnique({
      where: { studentId_courseId: { studentId, courseId: lesson.module.courseId } },
    });
    if (!enrollment) {
      throw notFound('Not enrolled in this course', 'NOT_ENROLLED');
    }

    await this.prisma.lessonProgress.upsert({
      where: { enrollmentId_lessonId: { enrollmentId: enrollment.id, lessonId } },
      update: {},
      create: { enrollmentId: enrollment.id, lessonId },
    });
    return { ok: true };
  }

  async myProgress(studentId: string): Promise<EnrollmentProgress[]> {
    const enrollments = await this.prisma.enrollment.findMany({
      where: { studentId },
      include: {
        course: {
          include: {
            teacher: true,
            modules: { include: { lessons: { select: { id: true } } } },
          },
        },
        progress: { select: { lessonId: true } },
      },
    });

    return enrollments.map((e) => {
      const totalLessons = e.course.modules.reduce((sum, m) => sum + m.lessons.length, 0);
      const completedLessonIds = e.progress.map((p) => p.lessonId);
      const completedCount = completedLessonIds.length;
      return {
        enrollmentId: e.id,
        course: toCourse(e.course),
        completedLessonIds,
        totalLessons,
        completedCount,
        percentComplete: totalLessons === 0 ? 0 : Math.round((completedCount / totalLessons) * 100),
      };
    });
  }
}
