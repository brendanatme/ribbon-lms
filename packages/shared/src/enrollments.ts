import { z } from 'zod';
import { courseSchema } from './courses.js';

export const createEnrollmentSchema = z.object({
  courseId: z.string(),
});
export type CreateEnrollmentInput = z.infer<typeof createEnrollmentSchema>;

export const enrollmentProgressSchema = z.object({
  enrollmentId: z.string(),
  course: courseSchema,
  completedLessonIds: z.array(z.string()),
  totalLessons: z.number(),
  completedCount: z.number(),
  percentComplete: z.number(),
});
export type EnrollmentProgress = z.infer<typeof enrollmentProgressSchema>;

export const courseAnalyticsSchema = z.object({
  courseId: z.string(),
  title: z.string(),
  enrollmentCount: z.number(),
  completionRate: z.number(),
  averageProgress: z.number(),
  lessonCompletion: z.array(
    z.object({
      lessonId: z.string(),
      title: z.string(),
      completedCount: z.number(),
    }),
  ),
});
export type CourseAnalytics = z.infer<typeof courseAnalyticsSchema>;
