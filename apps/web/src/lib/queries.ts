import type { CourseDetail, EnrollmentProgress } from '@ribbon/shared';
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

export const courseEditQuery = (id: string) => ({
  queryKey: ['course-edit', id] as const,
  queryFn: () => api.get<CourseDetail>(`/courses/${id}`),
});

export const catalogDetailQuery = (id: string) => ({
  queryKey: ['catalog-detail', id] as const,
  queryFn: () => api.get<CourseDetail>(`/catalog/${id}`),
});
