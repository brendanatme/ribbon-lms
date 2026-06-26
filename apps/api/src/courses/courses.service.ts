import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import type {
  Course,
  CourseDetail,
  CreateCourseInput,
  CreateLessonInput,
  CreateModuleInput,
  UpdateCourseInput,
} from '@ribbon/shared';
import type { Course as PrismaCourse } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class CoursesService {
  constructor(private readonly prisma: PrismaService) {}

  private toCourse(c: PrismaCourse & { teacher?: { name: string } }): Course {
    return {
      id: c.id,
      title: c.title,
      description: c.description,
      teacherId: c.teacherId,
      teacherName: c.teacher?.name,
      published: c.published,
      createdAt: c.createdAt.toISOString(),
    };
  }

  /** Throws if the course does not exist or is not owned by the teacher. */
  private async assertOwner(courseId: string, teacherId: string) {
    const course = await this.prisma.course.findUnique({ where: { id: courseId } });
    if (!course) throw new NotFoundException({ message: 'Course not found', code: 'NOT_FOUND' });
    if (course.teacherId !== teacherId) {
      throw new ForbiddenException({ message: 'Not your course', code: 'FORBIDDEN' });
    }
    return course;
  }

  private async assertOwnsModule(moduleId: string, teacherId: string) {
    const mod = await this.prisma.module.findUnique({
      where: { id: moduleId },
      include: { course: true },
    });
    if (!mod) throw new NotFoundException({ message: 'Module not found', code: 'NOT_FOUND' });
    if (mod.course.teacherId !== teacherId) {
      throw new ForbiddenException({ message: 'Not your course', code: 'FORBIDDEN' });
    }
    return mod;
  }

  listForTeacher(teacherId: string) {
    return this.prisma.course
      .findMany({ where: { teacherId }, orderBy: { createdAt: 'desc' } })
      .then((rows) => rows.map((c) => this.toCourse(c)));
  }

  create(teacherId: string, dto: CreateCourseInput) {
    return this.prisma.course.create({ data: { ...dto, teacherId } }).then((c) => this.toCourse(c));
  }

  async update(teacherId: string, courseId: string, dto: UpdateCourseInput) {
    await this.assertOwner(courseId, teacherId);
    const updated = await this.prisma.course.update({ where: { id: courseId }, data: dto });
    return this.toCourse(updated);
  }

  async remove(teacherId: string, courseId: string) {
    await this.assertOwner(courseId, teacherId);
    await this.prisma.course.delete({ where: { id: courseId } });
    return { ok: true };
  }

  async setPublished(teacherId: string, courseId: string, published: boolean) {
    await this.assertOwner(courseId, teacherId);
    const updated = await this.prisma.course.update({
      where: { id: courseId },
      data: { published },
    });
    return this.toCourse(updated);
  }

  async addModule(teacherId: string, courseId: string, dto: CreateModuleInput) {
    await this.assertOwner(courseId, teacherId);
    return this.prisma.module.create({ data: { ...dto, courseId } });
  }

  async addLesson(teacherId: string, moduleId: string, dto: CreateLessonInput) {
    await this.assertOwnsModule(moduleId, teacherId);
    return this.prisma.lesson.create({ data: { ...dto, moduleId } });
  }

  async detailForTeacher(teacherId: string, courseId: string): Promise<CourseDetail> {
    await this.assertOwner(courseId, teacherId);
    return this.detail(courseId);
  }

  /** Shared course detail with ordered modules + lessons. */
  async detail(courseId: string): Promise<CourseDetail> {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
      include: {
        teacher: true,
        modules: {
          orderBy: { order: 'asc' },
          include: { lessons: { orderBy: { order: 'asc' } } },
        },
      },
    });
    if (!course) throw new NotFoundException({ message: 'Course not found', code: 'NOT_FOUND' });

    const modules = course.modules.map((m) => ({
      id: m.id,
      courseId: m.courseId,
      title: m.title,
      order: m.order,
      lessons: m.lessons.map((l) => ({
        id: l.id,
        moduleId: l.moduleId,
        title: l.title,
        content: l.content,
        order: l.order,
        durationMin: l.durationMin,
      })),
    }));

    return {
      ...this.toCourse(course),
      modules,
      lessonCount: modules.reduce((sum, m) => sum + m.lessons.length, 0),
    };
  }
}
