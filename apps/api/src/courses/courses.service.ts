import { Injectable } from '@nestjs/common';
import type {
  CourseDetail,
  CreateCourseInput,
  CreateLessonInput,
  CreateModuleInput,
  UpdateCourseInput,
} from '@ribbon/shared';
import { PrismaService } from '@/prisma/prisma.service';
import { forbidden, notFound } from '@/common/exceptions';
import { toCourse } from '@/common/mappers/course.mapper';

@Injectable()
export class CoursesService {
  constructor(private readonly prisma: PrismaService) {}

  /** Throws if the course does not exist or is not owned by the teacher. */
  async assertOwner(courseId: string, teacherId: string) {
    const course = await this.prisma.course.findUnique({ where: { id: courseId } });
    if (!course) throw notFound('Course not found');
    if (course.teacherId !== teacherId) throw forbidden('Not your course');
    return course;
  }

  private async assertOwnsModule(moduleId: string, teacherId: string) {
    const mod = await this.prisma.module.findUnique({
      where: { id: moduleId },
      include: { course: true },
    });
    if (!mod) throw notFound('Module not found');
    if (mod.course.teacherId !== teacherId) throw forbidden('Not your course');
    return mod;
  }

  async listForTeacher(teacherId: string) {
    const rows = await this.prisma.course.findMany({
      where: { teacherId },
      orderBy: { createdAt: 'desc' },
    });
    return rows.map(toCourse);
  }

  async create(teacherId: string, dto: CreateCourseInput) {
    const course = await this.prisma.course.create({ data: { ...dto, teacherId } });
    return toCourse(course);
  }

  async update(teacherId: string, courseId: string, dto: UpdateCourseInput) {
    await this.assertOwner(courseId, teacherId);
    const updated = await this.prisma.course.update({ where: { id: courseId }, data: dto });
    return toCourse(updated);
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
    return toCourse(updated);
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
    if (!course) throw notFound('Course not found');

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
      ...toCourse(course),
      modules,
      lessonCount: modules.reduce((sum, m) => sum + m.lessons.length, 0),
    };
  }
}
