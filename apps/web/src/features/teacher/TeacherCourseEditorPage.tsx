import { useState, type FormEvent } from 'react';
import { useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type {
  Course,
  CreateLessonInput,
  CreateModuleInput,
  Lesson,
  Module,
  UpdateLessonInput,
} from '@ribbon/shared';
import { api } from '@/lib/api';
import { courseEditQuery } from '@/lib/queries';
import { Button, Card, Input, Loading, PageHeading, Textarea } from '@/components/ui';
import { QuizEditor } from './QuizEditor';
import { QuizResultsPanel } from './QuizResultsPanel';

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

  const removeModuleMutation = useMutation({
    mutationFn: (moduleId: string) => api.del(`/modules/${moduleId}`),
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
        content: '',
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
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold">{mod.title}</h3>
              <Button
                variant="danger"
                onClick={() => {
                  if (confirm(`Delete module “${mod.title}” and its lessons?`)) {
                    removeModuleMutation.mutate(mod.id);
                  }
                }}
              >
                Delete module
              </Button>
            </div>
            <ul className="mb-3 space-y-2">
              {mod.lessons.map((lesson) => (
                <li key={lesson.id}>
                  <LessonRow lesson={lesson} onChanged={invalidate} />
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

/**
 * A single lesson in the editor: collapsed to a summary row until expanded, then
 * exposes editable title, duration, and text content. Edits are buffered in
 * local state and persisted via PATCH /lessons/:id on save.
 */
function LessonRow({ lesson, onChanged }: { lesson: Lesson; onChanged: () => void }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(lesson.title);
  const [durationMin, setDurationMin] = useState(lesson.durationMin);
  const [content, setContent] = useState(lesson.content);

  const updateMutation = useMutation({
    mutationFn: (input: UpdateLessonInput) => api.patch(`/lessons/${lesson.id}`, input),
    onSuccess: () => {
      onChanged();
      setOpen(false);
    },
  });

  const removeMutation = useMutation({
    mutationFn: () => api.del(`/lessons/${lesson.id}`),
    onSuccess: onChanged,
  });

  if (!open) {
    return (
      <div className="flex items-center justify-between rounded-lg bg-sand px-3 py-2 text-sm">
        <span>{lesson.title}</span>
        <div className="flex items-center gap-3">
          <span className="text-ink/40">{lesson.durationMin} min</span>
          <button onClick={() => setOpen(true)} className="font-medium text-ribbon hover:underline">
            Edit
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2 rounded-lg border border-ink/15 bg-white p-3">
      <div className="flex gap-2">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Lesson title"
          className="flex-1"
        />
        <Input
          type="number"
          min={1}
          value={durationMin}
          onChange={(e) => setDurationMin(Number(e.target.value))}
          className="w-20"
        />
      </div>
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Lesson content…"
        rows={6}
        className="w-full"
      />
      <QuizEditor lessonId={lesson.id} />
      {lesson.hasQuiz && <QuizResultsPanel lessonId={lesson.id} />}
      <div className="flex items-center justify-between">
        <Button
          variant="danger"
          onClick={() => {
            if (confirm(`Delete lesson “${lesson.title}”?`)) removeMutation.mutate();
          }}
        >
          Delete
        </Button>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => updateMutation.mutate({ title, durationMin, content })}
            disabled={updateMutation.isPending}
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}
