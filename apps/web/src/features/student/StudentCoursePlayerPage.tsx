import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Lesson } from '@ribbon/shared';
import { api } from '@/lib/api';
import { catalogDetailQuery, enrollmentsQuery } from '@/lib/queries';
import { Button, Card, Loading, PageHeading, ProgressBar } from '@/components/ui';

export function StudentCoursePlayerPage() {
  const { id = '' } = useParams();
  const queryClient = useQueryClient();
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);

  const { data: course } = useQuery(catalogDetailQuery(id));

  const { data: enrollments } = useQuery(enrollmentsQuery());

  const progress = enrollments?.find((e) => e.course.id === id);
  const completed = useMemo(() => new Set(progress?.completedLessonIds ?? []), [progress]);

  const completeMutation = useMutation({
    mutationFn: (lessonId: string) => api.post(`/lessons/${lessonId}/complete`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: enrollmentsQuery().queryKey }),
  });

  const lessons: Lesson[] = course?.modules.flatMap((m) => m.lessons) ?? [];
  const activeLesson = lessons.find((l) => l.id === activeLessonId) ?? lessons[0];

  if (!course) return <Loading>Loading course…</Loading>;

  return (
    <div>
      <PageHeading title={course.title} subtitle={`by ${course.teacherName}`} />

      {progress && (
        <div className="mb-6">
          <div className="mb-1 flex justify-between text-sm text-ink/60">
            <span>Your progress</span>
            <span>{progress.percentComplete}%</span>
          </div>
          <ProgressBar percent={progress.percentComplete} />
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-[260px_1fr]">
        <nav className="space-y-4">
          {course.modules.map((mod) => (
            <div key={mod.id}>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink/40">
                {mod.title}
              </p>
              <ul className="space-y-1">
                {mod.lessons.map((lesson) => (
                  <li key={lesson.id}>
                    <button
                      onClick={() => setActiveLessonId(lesson.id)}
                      className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm ${
                        activeLesson?.id === lesson.id
                          ? 'bg-ribbon-light text-ribbon'
                          : 'hover:bg-sand'
                      }`}
                    >
                      <span
                        className={`grid h-5 w-5 flex-shrink-0 place-items-center rounded-full border text-xs ${
                          completed.has(lesson.id)
                            ? 'border-ribbon bg-ribbon text-white'
                            : 'border-ink/20 text-transparent'
                        }`}
                      >
                        ✓
                      </span>
                      {lesson.title}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <Card>
          {activeLesson ? (
            <article>
              <h2 className="mb-3 font-display text-2xl font-semibold">{activeLesson.title}</h2>
              <p className="mb-6 whitespace-pre-wrap leading-relaxed text-ink/80">
                {activeLesson.content || 'No content for this lesson yet.'}
              </p>
              <Button
                onClick={() => completeMutation.mutate(activeLesson.id)}
                disabled={completed.has(activeLesson.id) || completeMutation.isPending}
              >
                {completed.has(activeLesson.id) ? 'Completed' : 'Mark complete'}
              </Button>
            </article>
          ) : (
            <p className="text-ink/40">This course has no lessons yet.</p>
          )}
        </Card>
      </div>
    </div>
  );
}
