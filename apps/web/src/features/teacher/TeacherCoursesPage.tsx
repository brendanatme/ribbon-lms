import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Course, CreateCourseInput } from '@ribbon/shared';
import { api } from '@/lib/api';
import {
  Badge,
  Button,
  Card,
  EmptyState,
  Input,
  Loading,
  PageHeading,
  Textarea,
} from '@/components/ui';

export function TeacherCoursesPage() {
  const queryClient = useQueryClient();
  const [creating, setCreating] = useState(false);

  const { data: courses, isLoading } = useQuery({
    queryKey: ['teacher-courses'],
    queryFn: () => api.get<Course[]>('/teacher/courses'),
  });

  const createMutation = useMutation({
    mutationFn: (input: CreateCourseInput) => api.post<Course>('/courses', input),
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
            <Input name="title" placeholder="Course title" required className="w-full" />
            <Textarea
              name="description"
              placeholder="What will students learn?"
              rows={3}
              className="w-full"
            />
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Creating…' : 'Create course'}
            </Button>
          </form>
        </Card>
      )}

      {isLoading && <Loading>Loading courses…</Loading>}

      <div className="grid gap-4 sm:grid-cols-2">
        {courses?.map((course) => (
          <Card key={course.id}>
            <div className="mb-2 flex items-start justify-between gap-2">
              <h3 className="font-display text-lg font-semibold">{course.title}</h3>
              {course.published ? <Badge>Published</Badge> : <Badge tone="amber">Draft</Badge>}
            </div>
            <p className="mb-4 text-sm text-ink/60">
              {course.description || 'No description yet.'}
            </p>
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
        <EmptyState>No courses yet. Create your first course to get started.</EmptyState>
      )}
    </div>
  );
}
