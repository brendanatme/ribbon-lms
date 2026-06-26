import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Course, EnrollmentProgress } from '@ribbon/shared';
import { api, ApiError } from '../../lib/api.js';
import { Button, Card, PageHeading } from '../../components/ui.js';

type CatalogCourse = Course & { enrollmentCount: number };

export function StudentCatalogPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: courses, isLoading } = useQuery({
    queryKey: ['catalog'],
    queryFn: () => api.get<CatalogCourse[]>('/catalog'),
  });

  const { data: enrollments } = useQuery({
    queryKey: ['my-progress'],
    queryFn: () => api.get<EnrollmentProgress[]>('/enrollments'),
  });

  const enrolledIds = new Set(enrollments?.map((e) => e.course.id));

  const enrollMutation = useMutation({
    mutationFn: (courseId: string) => api.post('/enrollments', { courseId }),
    onSuccess: (_data, courseId) => {
      queryClient.invalidateQueries({ queryKey: ['my-progress'] });
      navigate(`/student/courses/${courseId}`);
    },
    onError: (err, courseId) => {
      // Already enrolled — just go to the course.
      if (err instanceof ApiError && err.code === 'ALREADY_ENROLLED') {
        navigate(`/student/courses/${courseId}`);
      }
    },
  });

  return (
    <div>
      <PageHeading title="Course catalog" subtitle="Browse and enroll — all free" />

      {isLoading && <p className="text-ink/40">Loading catalog…</p>}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {courses?.map((course) => {
          const enrolled = enrolledIds.has(course.id);
          return (
            <Card key={course.id} className="flex flex-col">
              <h3 className="font-display text-lg font-semibold">{course.title}</h3>
              <p className="mt-1 text-xs text-ink/50">by {course.teacherName}</p>
              <p className="mt-2 flex-1 text-sm text-ink/60">{course.description}</p>
              <p className="mt-3 text-xs text-ink/40">{course.enrollmentCount} enrolled</p>
              <div className="mt-3">
                {enrolled ? (
                  <Button
                    variant="ghost"
                    onClick={() => navigate(`/student/courses/${course.id}`)}
                    className="w-full"
                  >
                    Continue
                  </Button>
                ) : (
                  <Button onClick={() => enrollMutation.mutate(course.id)} className="w-full">
                    Enroll
                  </Button>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {courses && courses.length === 0 && (
        <Card>
          <p className="text-center text-ink/50">No published courses available yet.</p>
        </Card>
      )}
    </div>
  );
}
