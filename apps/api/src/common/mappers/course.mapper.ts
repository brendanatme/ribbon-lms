import type { Course } from '@ribbon/shared';
import type { Course as PrismaCourse } from '@prisma/client';

/**
 * Maps a Prisma Course row to the Course DTO. When the `teacher` relation is
 * included, its name is surfaced as `teacherName`.
 */
export function toCourse(c: PrismaCourse & { teacher?: { name: string } }): Course {
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
