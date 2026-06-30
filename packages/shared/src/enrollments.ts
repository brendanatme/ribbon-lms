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

/**
 * A student's final standing in a course, surfaced on the completion screen.
 * `averageScore` is the mean of the student's best score on each quiz they
 * attempted; ranking compares that against every other student who has
 * attempted at least one quiz in the course.
 */
export const courseResultSchema = z.object({
  courseId: z.string(),
  title: z.string(),
  averageScore: z.number(), // 0-100, mean of best quiz scores
  quizzesTaken: z.number(),
  totalQuizzes: z.number(),
  cohortSize: z.number(), // students with a comparable score (incl. this one)
  rank: z.number(), // 1-based; 1 = top of the cohort. 0 when not ranked.
  percentile: z.number(), // 0-100: share of the cohort scored at or below this student
});
export type CourseResult = z.infer<typeof courseResultSchema>;

export const courseAnalyticsSchema = z.object({
  courseId: z.string(),
  title: z.string(),
  enrollmentCount: z.number(),
  completionRate: z.number(),
  averageProgress: z.number(),
  // Mean of every student's best score across all quizzes in the course.
  averageQuizScore: z.number(),
  lessonCompletion: z.array(
    z.object({
      lessonId: z.string(),
      title: z.string(),
      completedCount: z.number(),
    }),
  ),
  quizStats: z.array(
    z.object({
      lessonId: z.string(),
      title: z.string(),
      averageScore: z.number(),
      attemptCount: z.number(),
    }),
  ),
});
export type CourseAnalytics = z.infer<typeof courseAnalyticsSchema>;
