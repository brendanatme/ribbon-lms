import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { QuestionType } from '@ribbon/shared';
import type { AttemptResult, SubmitAttemptInput, QuizTake } from '@ribbon/shared';
import { api } from '@/lib/api';
import { quizMyResultQuery, quizTakeQuery } from '@/lib/queries';
import { Badge, Button, Card, Input, Loading } from '@/components/ui';
import { MarkdownInline } from '@/components/Markdown';

type AnswerState = { selectedOptionIds: string[]; textValue: string; numberValue: string };

const blankAnswer = (): AnswerState => ({ selectedOptionIds: [], textValue: '', numberValue: '' });

export function QuizPlayer({ lessonId }: { lessonId: string }) {
  const queryClient = useQueryClient();
  const { data: quiz, isLoading } = useQuery(quizTakeQuery(lessonId));
  const { data: best } = useQuery(quizMyResultQuery(lessonId));

  const [answers, setAnswers] = useState<Record<string, AnswerState>>({});
  const [result, setResult] = useState<AttemptResult | null>(null);

  const submitMutation = useMutation({
    mutationFn: (payload: SubmitAttemptInput) =>
      api.post<AttemptResult>(`/lessons/${lessonId}/quiz/attempts`, payload),
    onSuccess: (res) => {
      setResult(res);
      queryClient.invalidateQueries({ queryKey: quizMyResultQuery(lessonId).queryKey });
    },
  });

  if (isLoading || !quiz) return <Loading>Loading quiz…</Loading>;

  const answerFor = (qId: string) => answers[qId] ?? blankAnswer();
  const patch = (qId: string, p: Partial<AnswerState>) =>
    setAnswers((a) => ({ ...a, [qId]: { ...answerFor(qId), ...p } }));

  function toggleOption(q: QuizTake['questions'][number], optionId: string) {
    const current = answerFor(q.id).selectedOptionIds;
    if (q.type === QuestionType.SINGLE_CHOICE) {
      patch(q.id, { selectedOptionIds: [optionId] });
    } else {
      patch(q.id, {
        selectedOptionIds: current.includes(optionId)
          ? current.filter((id) => id !== optionId)
          : [...current, optionId],
      });
    }
  }

  function submit() {
    const payload: SubmitAttemptInput = {
      answers: quiz!.questions.map((q) => {
        const a = answerFor(q.id);
        return {
          questionId: q.id,
          selectedOptionIds: a.selectedOptionIds,
          textValue: q.type === QuestionType.TEXT ? a.textValue : null,
          numberValue:
            q.type === QuestionType.NUMBER && a.numberValue !== '' ? Number(a.numberValue) : null,
        };
      }),
    };
    submitMutation.mutate(payload);
  }

  const resultById = new Map(result?.answers.map((a) => [a.questionId, a.isCorrect]));

  return (
    <Card className="mt-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-lg font-semibold">{quiz.title || 'Quiz'}</h3>
        {best && (
          <Badge tone={best.bestScore >= 70 ? 'ribbon' : 'amber'}>Best: {best.bestScore}%</Badge>
        )}
      </div>

      <ol className="space-y-5">
        {quiz.questions.map((q, i) => {
          const a = answerFor(q.id);
          const graded = resultById.get(q.id);
          return (
            <li key={q.id}>
              <div className="mb-2 flex items-start gap-2 font-medium">
                <span className="text-ink/40">{i + 1}.</span>
                <div className="min-w-0 flex-1">
                  <MarkdownInline content={q.prompt} />
                </div>
                {result &&
                  (graded ? (
                    <span className="whitespace-nowrap text-sm text-ribbon">✓ correct</span>
                  ) : (
                    <span className="whitespace-nowrap text-sm text-red-600">✗ incorrect</span>
                  ))}
              </div>

              {(q.type === QuestionType.SINGLE_CHOICE ||
                q.type === QuestionType.MULTIPLE_CHOICE) && (
                <div className="space-y-1">
                  {q.options.map((o) => (
                    <label key={o.id} className="flex items-center gap-2 text-sm">
                      <input
                        type={q.type === QuestionType.SINGLE_CHOICE ? 'radio' : 'checkbox'}
                        name={q.id}
                        checked={a.selectedOptionIds.includes(o.id)}
                        onChange={() => toggleOption(q, o.id)}
                        disabled={!!result}
                      />
                      {o.text}
                    </label>
                  ))}
                </div>
              )}

              {q.type === QuestionType.TEXT && (
                <Input
                  value={a.textValue}
                  onChange={(e) => patch(q.id, { textValue: e.target.value })}
                  disabled={!!result}
                  placeholder="Your answer"
                  className="w-full"
                />
              )}

              {q.type === QuestionType.NUMBER && (
                <Input
                  type="number"
                  value={a.numberValue}
                  onChange={(e) => patch(q.id, { numberValue: e.target.value })}
                  disabled={!!result}
                  placeholder="Your answer"
                  className="w-40"
                />
              )}
            </li>
          );
        })}
      </ol>

      <div className="mt-5 flex items-center gap-4">
        {result ? (
          <>
            <span className="font-display text-xl font-semibold text-ribbon">{result.score}%</span>
            <span className="text-sm text-ink/60">
              {result.pointsEarned}/{result.pointsPossible} points
            </span>
            <Button
              variant="ghost"
              onClick={() => {
                setResult(null);
                setAnswers({});
              }}
            >
              Retake
            </Button>
          </>
        ) : (
          <Button onClick={submit} disabled={submitMutation.isPending}>
            Submit quiz
          </Button>
        )}
      </div>
    </Card>
  );
}
