import type {
  CourseDetail,
  CourseResult,
  EnrollmentProgress,
  QuizAttemptSummary,
  QuizAuthor,
  QuizResults,
  QuizTake,
} from '@ribbon/shared';
import { api } from './api';

/**
 * Shared React Query option factories. Centralising the query key + endpoint
 * pairs here keeps every consumer in sync — notably the breadcrumb trail, which
 * relies on hitting the exact same cache entry as the page it labels. Changing a
 * key or URL in one place can no longer silently turn a cache hit into a refetch.
 */

export const enrollmentsQuery = () => ({
  queryKey: ['my-progress'] as const,
  queryFn: () => api.get<EnrollmentProgress[]>('/enrollments'),
});

export const courseResultQuery = (courseId: string) => ({
  queryKey: ['course-result', courseId] as const,
  queryFn: () => api.get<CourseResult>(`/enrollments/${courseId}/result`),
});

export const courseEditQuery = (id: string) => ({
  queryKey: ['course-edit', id] as const,
  queryFn: () => api.get<CourseDetail>(`/courses/${id}`),
});

export const catalogDetailQuery = (id: string) => ({
  queryKey: ['catalog-detail', id] as const,
  queryFn: () => api.get<CourseDetail>(`/catalog/${id}`),
});

export const quizAuthorQuery = (lessonId: string) => ({
  queryKey: ['quiz-author', lessonId] as const,
  queryFn: () => api.get<QuizAuthor | null>(`/lessons/${lessonId}/quiz`),
});

export const quizTakeQuery = (lessonId: string) => ({
  queryKey: ['quiz-take', lessonId] as const,
  queryFn: () => api.get<QuizTake>(`/lessons/${lessonId}/quiz/take`),
});

export const quizMyResultQuery = (lessonId: string) => ({
  queryKey: ['quiz-my-result', lessonId] as const,
  queryFn: () => api.get<QuizAttemptSummary | null>(`/lessons/${lessonId}/quiz/my-result`),
});

export const quizResultsQuery = (lessonId: string) => ({
  queryKey: ['quiz-results', lessonId] as const,
  queryFn: () => api.get<QuizResults>(`/lessons/${lessonId}/quiz/results`),
});
