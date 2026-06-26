import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import type { CourseDetail, EnrollmentProgress } from '@ribbon/shared';
import { PrismaService } from '../prisma/prisma.service.js';
import { CoursesService } from '../courses/courses.service.js';

@Injectable()
export class EnrollmentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly courses: CoursesService,
  ) {}

  async catalog() {
    const rows = await this.prisma.course.findMany({
      where: { published: true },
      include: { teacher: true, _count: { select: { enrollments: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return rows.map((c) => ({
      id: c.id,
      title: c.title,
      description: c.description,
      teacherId: c.teacherId,
      teacherName: c.teacher.name,
      published: c.published,
      createdAt: c.createdAt.toISOString(),
      enrollmentCount: c._count.enrollments,
    }));
  }

  async catalogDetail(courseId: string): Promise<CourseDetail> {
    const course = await this.prisma.course.findFirst({
      where: { id: courseId, published: true },
    });
    if (!course) throw new NotFoundException({ message: 'Course not found', code: 'NOT_FOUND' });
    return this.courses.detail(courseId);
  }

  async enroll(studentId: string, courseId: string) {
    const course = await this.prisma.course.findFirst({
      where: { id: courseId, published: true },
    });
    if (!course)
      throw new NotFoundException({ message: 'Course not available', code: 'NOT_FOUND' });

    const existing = await this.prisma.enrollment.findUnique({
      where: { studentId_courseId: { studentId, courseId } },
    });
    if (existing) {
      throw new ConflictException({ message: 'Already enrolled', code: 'ALREADY_ENROLLED' });
    }
    return this.prisma.enrollment.create({ data: { studentId, courseId } });
  }

  async completeLesson(studentId: string, lessonId: string) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id: lessonId },
      include: { module: true },
    });
    if (!lesson) throw new NotFoundException({ message: 'Lesson not found', code: 'NOT_FOUND' });

    const enrollment = await this.prisma.enrollment.findUnique({
      where: { studentId_courseId: { studentId, courseId: lesson.module.courseId } },
    });
    if (!enrollment) {
      throw new NotFoundException({ message: 'Not enrolled in this course', code: 'NOT_ENROLLED' });
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
        course: {
          id: e.course.id,
          title: e.course.title,
          description: e.course.description,
          teacherId: e.course.teacherId,
          teacherName: e.course.teacher.name,
          published: e.course.published,
          createdAt: e.course.createdAt.toISOString(),
        },
        completedLessonIds,
        totalLessons,
        completedCount,
        percentComplete: totalLessons === 0 ? 0 : Math.round((completedCount / totalLessons) * 100),
      };
    });
  }
}
