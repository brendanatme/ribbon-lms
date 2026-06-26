import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Course, CreateCourseInput } from '@ribbon/shared';
import { api } from '../../lib/api.js';
import { Badge, Button, Card, PageHeading } from '../../components/ui.js';

export function TeacherCoursesPage() {
  const queryClient = useQueryClient();
  const [creating, setCreating] = useState(false);

  const { data: courses, isLoading } = useQuery({
    queryKey: ['teacher-courses'],
    queryFn: () => api<Course[]>('/teacher/courses'),
  });

  const createMutation = useMutation({
    mutationFn: (input: CreateCourseInput) =>
      api<Course>('/courses', { method: 'POST', body: input }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teacher-courses'] });
      setCreating(false);
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <PageHeading title="My courses" subtitle="Create and manage your course catalog" />
        <Button onClick={() => setCreating((v) => !v)}>{creating ? 'Cancel' : 'New course'}</Button>
      </div>

      {creating && (
        <Card className="mb-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const form = new FormData(e.currentTarget);
              createMutation.mutate({
                title: String(form.get('title')),
                description: String(form.get('description')),
              });
            }}
            className="space-y-3"
          >
            <input
              name="title"
              placeholder="Course title"
              required
              className="w-full rounded-lg border border-ink/15 px-3 py-2 text-sm focus:border-ribbon focus:outline-none"
            />
            <textarea
              name="description"
              placeholder="What will students learn?"
              rows={3}
              className="w-full rounded-lg border border-ink/15 px-3 py-2 text-sm focus:border-ribbon focus:outline-none"
            />
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Creating…' : 'Create course'}
            </Button>
          </form>
        </Card>
      )}

      {isLoading && <p className="text-ink/40">Loading courses…</p>}

      <div className="grid gap-4 sm:grid-cols-2">
        {courses?.map((course) => (
          <Card key={course.id}>
            <div className="mb-2 flex items-start justify-between gap-2">
              <h3 className="font-display text-lg font-semibold">{course.title}</h3>
              {course.published ? <Badge>Published</Badge> : (
                <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700">
                  Draft
                </span>
              )}
            </div>
            <p className="mb-4 text-sm text-ink/60">{course.description || 'No description yet.'}</p>
            <div className="flex gap-2">
              <Link to={`/teacher/courses/${course.id}`}>
                <Button variant="ghost">Edit</Button>
              </Link>
              <Link to={`/teacher/courses/${course.id}/analytics`}>
                <Button variant="ghost">Analytics</Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>

      {courses && courses.length === 0 && (
        <Card>
          <p className="text-center text-ink/50">
            No courses yet. Create your first course to get started.
          </p>
        </Card>
      )}
    </div>
  );
}
