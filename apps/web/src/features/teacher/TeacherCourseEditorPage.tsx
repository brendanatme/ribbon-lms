import type { FormEvent } from 'react';
import { useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Course, CreateLessonInput, CreateModuleInput, Module } from '@ribbon/shared';
import { api } from '@/lib/api';
import { courseEditQuery } from '@/lib/queries';
import { Button, Card, Input, Loading, PageHeading } from '@/components/ui';

export function TeacherCourseEditorPage() {
  const { id = '' } = useParams();
  const queryClient = useQueryClient();
  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: courseEditQuery(id).queryKey });

  const { data: course, isLoading } = useQuery(courseEditQuery(id));

  const publishMutation = useMutation({
    mutationFn: (publish: boolean) =>
      api.patch<Course>(`/courses/${id}/${publish ? 'publish' : 'unpublish'}`),
    onSuccess: invalidate,
  });

  const addModuleMutation = useMutation({
    mutationFn: (input: CreateModuleInput) => api.post<Module>(`/courses/${id}/modules`, input),
    onSuccess: invalidate,
  });

  const addLessonMutation = useMutation({
    mutationFn: ({ moduleId, input }: { moduleId: string; input: CreateLessonInput }) =>
      api.post(`/modules/${moduleId}/lessons`, input),
    onSuccess: invalidate,
  });

  if (isLoading || !course) return <Loading>Loading course…</Loading>;

  function addLesson(e: FormEvent<HTMLFormElement>, moduleId: string, order: number) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    addLessonMutation.mutate({
      moduleId,
      input: {
        title: String(data.get('title')),
        content: String(data.get('content') ?? ''),
        order,
        durationMin: Number(data.get('durationMin') ?? 5),
      },
    });
    form.reset();
  }

  function addModule(e: FormEvent<HTMLFormElement>, order: number) {
    e.preventDefault();
    const form = e.currentTarget;
    addModuleMutation.mutate({ title: String(new FormData(form).get('title')), order });
    form.reset();
  }

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
                <li
                  key={lesson.id}
                  className="flex items-center justify-between rounded-lg bg-sand px-3 py-2 text-sm"
                >
                  <span>{lesson.title}</span>
                  <span className="text-ink/40">{lesson.durationMin} min</span>
                </li>
              ))}
              {mod.lessons.length === 0 && <li className="text-sm text-ink/40">No lessons yet.</li>}
            </ul>
            <form onSubmit={(e) => addLesson(e, mod.id, mod.lessons.length)} className="flex gap-2">
              <Input name="title" placeholder="New lesson title" required className="flex-1" />
              <Input name="durationMin" type="number" min={1} defaultValue={5} className="w-20" />
              <Button type="submit" variant="ghost">
                Add
              </Button>
            </form>
          </Card>
        ))}
      </div>

      <Card className="mt-4">
        <form onSubmit={(e) => addModule(e, course.modules.length)} className="flex gap-2">
          <Input name="title" placeholder="New module title" required className="flex-1" />
          <Button type="submit">Add module</Button>
        </form>
      </Card>
    </div>
  );
}
