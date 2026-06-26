import { useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type {
  Course,
  CourseDetail,
  CreateLessonInput,
  CreateModuleInput,
  Module,
} from '@ribbon/shared';
import { api } from '../../lib/api.js';
import { Button, Card, PageHeading } from '../../components/ui.js';

export function TeacherCourseEditorPage() {
  const { id = '' } = useParams();
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['course-edit', id] });

  const { data: course, isLoading } = useQuery({
    queryKey: ['course-edit', id],
    queryFn: () => api<CourseDetail>(`/courses/${id}`),
  });

  const publishMutation = useMutation({
    mutationFn: (publish: boolean) =>
      api<Course>(`/courses/${id}/${publish ? 'publish' : 'unpublish'}`, { method: 'PATCH' }),
    onSuccess: invalidate,
  });

  const addModuleMutation = useMutation({
    mutationFn: (input: CreateModuleInput) =>
      api<Module>(`/courses/${id}/modules`, { method: 'POST', body: input }),
    onSuccess: invalidate,
  });

  const addLessonMutation = useMutation({
    mutationFn: ({ moduleId, input }: { moduleId: string; input: CreateLessonInput }) =>
      api(`/modules/${moduleId}/lessons`, { method: 'POST', body: input }),
    onSuccess: invalidate,
  });

  if (isLoading || !course) return <p className="text-ink/40">Loading course…</p>;

  return (
    <div>
      <div className="flex items-center justify-between">
        <PageHeading title={course.title} subtitle={`${course.lessonCount} lessons`} />
        <Button
          variant={course.published ? 'ghost' : 'primary'}
          onClick={() => publishMutation.mutate(!course.published)}
        >
          {course.published ? 'Unpublish' : 'Publish'}
        </Button>
      </div>

      <div className="space-y-4">
        {course.modules.map((mod) => (
          <Card key={mod.id}>
            <h3 className="mb-3 font-display text-lg font-semibold">{mod.title}</h3>
            <ul className="mb-3 space-y-1">
              {mod.lessons.map((lesson) => (
                <li key={lesson.id} className="flex items-center justify-between rounded-lg bg-sand px-3 py-2 text-sm">
                  <span>{lesson.title}</span>
                  <span className="text-ink/40">{lesson.durationMin} min</span>
                </li>
              ))}
              {mod.lessons.length === 0 && <li className="text-sm text-ink/40">No lessons yet.</li>}
            </ul>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const data = new FormData(form);
                addLessonMutation.mutate({
                  moduleId: mod.id,
                  input: {
                    title: String(data.get('title')),
                    content: String(data.get('content') ?? ''),
                    order: mod.lessons.length,
                    durationMin: Number(data.get('durationMin') ?? 5),
                  },
                });
                form.reset();
              }}
              className="flex gap-2"
            >
              <input
                name="title"
                placeholder="New lesson title"
                required
                className="flex-1 rounded-lg border border-ink/15 px-3 py-1.5 text-sm focus:border-ribbon focus:outline-none"
              />
              <input
                name="durationMin"
                type="number"
                min={1}
                defaultValue={5}
                className="w-20 rounded-lg border border-ink/15 px-2 py-1.5 text-sm focus:border-ribbon focus:outline-none"
              />
              <Button type="submit" variant="ghost">
                Add
              </Button>
            </form>
          </Card>
        ))}
      </div>

      <Card className="mt-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const form = e.currentTarget;
            const data = new FormData(form);
            addModuleMutation.mutate({
              title: String(data.get('title')),
              order: course.modules.length,
            });
            form.reset();
          }}
          className="flex gap-2"
        >
          <input
            name="title"
            placeholder="New module title"
            required
            className="flex-1 rounded-lg border border-ink/15 px-3 py-2 text-sm focus:border-ribbon focus:outline-none"
          />
          <Button type="submit">Add module</Button>
        </form>
      </Card>
    </div>
  );
}
