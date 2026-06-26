import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { QuestionType } from '@ribbon/shared';
import type { QuizAuthor, UpsertQuizInput } from '@ribbon/shared';
import { api, ApiError } from '@/lib/api';
import { quizAuthorQuery } from '@/lib/queries';
import { Button, Card, Input, Loading, Textarea } from '@/components/ui';

const TYPE_LABELS: Record<QuestionType, string> = {
  [QuestionType.SINGLE_CHOICE]: 'Single choice',
  [QuestionType.MULTIPLE_CHOICE]: 'Multiple choice',
  [QuestionType.TEXT]: 'Text',
  [QuestionType.NUMBER]: 'Number',
};

type DraftOption = { key: string; text: string; isCorrect: boolean };
type DraftQuestion = {
  key: string;
  type: QuestionType;
  prompt: string;
  points: number;
  options: DraftOption[];
  correctText: string;
  correctNumber: string;
};

const uid = () => Math.random().toString(36).slice(2);
const isChoice = (t: QuestionType) =>
  t === QuestionType.SINGLE_CHOICE || t === QuestionType.MULTIPLE_CHOICE;

function blankOption(): DraftOption {
  return { key: uid(), text: '', isCorrect: false };
}

function blankQuestion(): DraftQuestion {
  return {
    key: uid(),
    type: QuestionType.SINGLE_CHOICE,
    prompt: '',
    points: 1,
    options: [blankOption(), blankOption()],
    correctText: '',
    correctNumber: '',
  };
}

function fromQuiz(quiz: QuizAuthor): DraftQuestion[] {
  return quiz.questions.map((q) => ({
    key: uid(),
    type: q.type,
    prompt: q.prompt,
    points: q.points,
    options: q.options.map((o) => ({ key: uid(), text: o.text, isCorrect: o.isCorrect })),
    correctText: q.correctText ?? '',
    correctNumber: q.correctNumber != null ? String(q.correctNumber) : '',
  }));
}

function toPayload(title: string, questions: DraftQuestion[]): UpsertQuizInput {
  return {
    title,
    questions: questions.map((q, qi) => ({
      type: q.type,
      prompt: q.prompt,
      order: qi,
      points: q.points,
      options: isChoice(q.type)
        ? q.options.map((o, oi) => ({ text: o.text, isCorrect: o.isCorrect, order: oi }))
        : [],
      correctText: q.type === QuestionType.TEXT ? q.correctText : null,
      correctNumber: q.type === QuestionType.NUMBER ? Number(q.correctNumber) : null,
    })),
  };
}

export function QuizEditor({ lessonId }: { lessonId: string }) {
  const queryClient = useQueryClient();
  const { data: quiz, isLoading } = useQuery(quizAuthorQuery(lessonId));

  if (isLoading) return <Loading>Loading quiz…</Loading>;
  // Remount the form when the loaded quiz identity changes so drafts re-seed.
  return (
    <QuizForm key={quiz?.id ?? 'new'} lessonId={lessonId} quiz={quiz ?? null} qc={queryClient} />
  );
}

function QuizForm({
  lessonId,
  quiz,
  qc,
}: {
  lessonId: string;
  quiz: QuizAuthor | null;
  qc: ReturnType<typeof useQueryClient>;
}) {
  const [title, setTitle] = useState(quiz?.title ?? '');
  const [questions, setQuestions] = useState<DraftQuestion[]>(quiz ? fromQuiz(quiz) : []);
  const [error, setError] = useState<string | null>(null);

  const invalidate = () => qc.invalidateQueries({ queryKey: quizAuthorQuery(lessonId).queryKey });

  const saveMutation = useMutation({
    mutationFn: (payload: UpsertQuizInput) => api.put(`/lessons/${lessonId}/quiz`, payload),
    onSuccess: () => {
      setError(null);
      invalidate();
    },
    onError: (e) => setError(e instanceof ApiError ? e.message : 'Could not save quiz'),
  });

  const removeMutation = useMutation({
    mutationFn: () => api.del(`/lessons/${lessonId}/quiz`),
    onSuccess: () => {
      setQuestions([]);
      setTitle('');
      invalidate();
    },
  });

  function patchQuestion(key: string, patch: Partial<DraftQuestion>) {
    setQuestions((qs) => qs.map((q) => (q.key === key ? { ...q, ...patch } : q)));
  }

  function patchOption(qKey: string, oKey: string, patch: Partial<DraftOption>) {
    setQuestions((qs) =>
      qs.map((q) =>
        q.key !== qKey
          ? q
          : { ...q, options: q.options.map((o) => (o.key === oKey ? { ...o, ...patch } : o)) },
      ),
    );
  }

  function toggleCorrect(q: DraftQuestion, oKey: string) {
    if (q.type === QuestionType.SINGLE_CHOICE) {
      patchQuestion(q.key, {
        options: q.options.map((o) => ({ ...o, isCorrect: o.key === oKey })),
      });
    } else {
      patchOption(q.key, oKey, { isCorrect: !q.options.find((o) => o.key === oKey)?.isCorrect });
    }
  }

  return (
    <div className="space-y-3 rounded-lg border border-dashed border-ink/20 bg-sand/40 p-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold uppercase tracking-wide text-ink/50">Quiz</h4>
        {quiz && (
          <button
            onClick={() => {
              if (confirm('Delete this quiz?')) removeMutation.mutate();
            }}
            className="text-xs font-medium text-red-600 hover:underline"
          >
            Remove quiz
          </button>
        )}
      </div>

      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Quiz title (optional)"
        className="w-full"
      />

      {questions.map((q, qi) => (
        <Card key={q.key} className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-ink/40">Q{qi + 1}</span>
            <select
              value={q.type}
              onChange={(e) => patchQuestion(q.key, { type: e.target.value as QuestionType })}
              className="rounded-lg border border-ink/15 px-2 py-1 text-sm"
            >
              {Object.values(QuestionType).map((t) => (
                <option key={t} value={t}>
                  {TYPE_LABELS[t]}
                </option>
              ))}
            </select>
            <Input
              type="number"
              min={1}
              value={q.points}
              onChange={(e) => patchQuestion(q.key, { points: Number(e.target.value) })}
              className="w-16"
              title="Points"
            />
            <button
              onClick={() => setQuestions((qs) => qs.filter((x) => x.key !== q.key))}
              className="ml-auto text-xs font-medium text-red-600 hover:underline"
            >
              Remove
            </button>
          </div>

          <Textarea
            value={q.prompt}
            onChange={(e) => patchQuestion(q.key, { prompt: e.target.value })}
            placeholder="Question prompt"
            rows={2}
            className="w-full"
          />

          {isChoice(q.type) && (
            <div className="space-y-1">
              {q.options.map((o) => (
                <div key={o.key} className="flex items-center gap-2">
                  <input
                    type={q.type === QuestionType.SINGLE_CHOICE ? 'radio' : 'checkbox'}
                    checked={o.isCorrect}
                    onChange={() => toggleCorrect(q, o.key)}
                    aria-label="Correct answer"
                  />
                  <Input
                    value={o.text}
                    onChange={(e) => patchOption(q.key, o.key, { text: e.target.value })}
                    placeholder="Option text"
                    className="flex-1"
                  />
                  <button
                    onClick={() =>
                      patchQuestion(q.key, { options: q.options.filter((x) => x.key !== o.key) })
                    }
                    className="text-xs text-ink/40 hover:text-red-600"
                  >
                    ✕
                  </button>
                </div>
              ))}
              <button
                onClick={() => patchQuestion(q.key, { options: [...q.options, blankOption()] })}
                className="text-xs font-medium text-ribbon hover:underline"
              >
                + Add option
              </button>
            </div>
          )}

          {q.type === QuestionType.TEXT && (
            <Input
              value={q.correctText}
              onChange={(e) => patchQuestion(q.key, { correctText: e.target.value })}
              placeholder="Accepted answer"
              className="w-full"
            />
          )}

          {q.type === QuestionType.NUMBER && (
            <Input
              type="number"
              value={q.correctNumber}
              onChange={(e) => patchQuestion(q.key, { correctNumber: e.target.value })}
              placeholder="Correct number"
              className="w-40"
            />
          )}
        </Card>
      ))}

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => setQuestions((qs) => [...qs, blankQuestion()])}>
          + Add question
        </Button>
        <Button
          onClick={() => saveMutation.mutate(toPayload(title, questions))}
          disabled={questions.length === 0 || saveMutation.isPending}
        >
          Save quiz
        </Button>
      </div>
    </div>
  );
}
