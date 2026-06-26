import { z } from 'zod';

export const createCourseSchema = z.object({
  title: z.string().min(3).max(120),
  description: z.string().max(2000).default(''),
});
export type CreateCourseInput = z.infer<typeof createCourseSchema>;

export const updateCourseSchema = createCourseSchema.partial();
export type UpdateCourseInput = z.infer<typeof updateCourseSchema>;

export const createModuleSchema = z.object({
  title: z.string().min(2).max(120),
  order: z.number().int().min(0).default(0),
});
export type CreateModuleInput = z.infer<typeof createModuleSchema>;

export const updateModuleSchema = createModuleSchema.partial();
export type UpdateModuleInput = z.infer<typeof updateModuleSchema>;

export const createLessonSchema = z.object({
  title: z.string().min(2).max(120),
  content: z.string().max(20000).default(''),
  order: z.number().int().min(0).default(0),
  durationMin: z.number().int().min(0).max(600).default(5),
});
export type CreateLessonInput = z.infer<typeof createLessonSchema>;

export const updateLessonSchema = createLessonSchema.partial();
export type UpdateLessonInput = z.infer<typeof updateLessonSchema>;

export const lessonSchema = z.object({
  id: z.string(),
  moduleId: z.string(),
  title: z.string(),
  content: z.string(),
  order: z.number(),
  durationMin: z.number(),
  hasQuiz: z.boolean().default(false),
});
export type Lesson = z.infer<typeof lessonSchema>;

export const moduleSchema = z.object({
  id: z.string(),
  courseId: z.string(),
  title: z.string(),
  order: z.number(),
  lessons: z.array(lessonSchema),
});
export type Module = z.infer<typeof moduleSchema>;

export const courseSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  teacherId: z.string(),
  teacherName: z.string().optional(),
  published: z.boolean(),
  createdAt: z.string(),
});
export type Course = z.infer<typeof courseSchema>;

export const courseDetailSchema = courseSchema.extend({
  modules: z.array(moduleSchema),
  lessonCount: z.number(),
});
export type CourseDetail = z.infer<typeof courseDetailSchema>;
