import { useQuery } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { courseResultQuery } from '@/lib/queries';
import { Card, Loading } from '@/components/ui';
import { Confetti } from './Confetti';

/**
 * The celebratory "you finished the course" screen. Shows the student's mean
 * quiz score and how it ranks against everyone else who has taken the course's
 * quizzes. `celebrateSeed` > 0 fires a confetti burst (and re-fires when it
 * changes), so the fanfare plays on the moment of completion but stays calm on
 * a later revisit.
 */
export function CourseCompletionPanel({
  courseId,
  celebrateSeed = 0,
}: {
  courseId: string;
  celebrateSeed?: number;
}) {
  const { data: result, isLoading } = useQuery(courseResultQuery(courseId));

  return (
    <Card className="relative mb-6 overflow-hidden border-ribbon/30 bg-ribbon-light">
      {celebrateSeed > 0 && <Confetti seed={celebrateSeed} />}

      <div className="relative text-center">
        <div className="text-4xl" role="img" aria-label="party popper">
          🎉
        </div>
        <h2 className="mt-2 font-display text-2xl font-semibold text-ink">Course complete!</h2>

        {isLoading || !result ? (
          <Loading>Tallying your results…</Loading>
        ) : (
          <>
            <p className="mt-1 text-sm text-ink/70">
              You finished <span className="font-medium">{result.title}</span>. Nicely done.
            </p>

            {result.quizzesTaken > 0 ? (
              <>
                <div className="mx-auto mt-5 grid max-w-md grid-cols-3 gap-3">
                  <Stat label="Quiz score" value={`${result.averageScore}%`} />
                  <Stat
                    label="Class rank"
                    value={`#${result.rank}`}
                    sub={`of ${result.cohortSize}`}
                  />
                  <Stat
                    label="Quizzes"
                    value={`${result.quizzesTaken}`}
                    sub={`of ${result.totalQuizzes}`}
                  />
                </div>
                <p className="mt-4 text-sm text-ink/70">{rankSentence(result)}</p>
              </>
            ) : (
              <p className="mx-auto mt-4 max-w-md text-sm text-ink/70">
                You completed every lesson! Take the lesson quizzes to earn a score and see how you
                rank against the class.
              </p>
            )}
          </>
        )}
      </div>
    </Card>
  );
}

function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-lg bg-white/70 px-3 py-3">
      <div className="font-display text-2xl font-semibold text-ribbon">{value}</div>
      {sub && <div className="text-xs text-ink/40">{sub}</div>}
      <div className="mt-1 text-xs font-medium uppercase tracking-wide text-ink/50">{label}</div>
    </div>
  );
}

/** Friendly relative-standing line, guarding the awkward edges (lone learner, last place). */
function rankSentence(r: { rank: number; cohortSize: number; averageScore: number }): ReactNode {
  if (r.cohortSize <= 1) {
    return "You're the first to complete this course — you set the pace! 🚀";
  }
  const beat = Math.round(((r.cohortSize - r.rank) / (r.cohortSize - 1)) * 100);
  if (r.rank === 1) {
    return (
      <>
        Top of the class — you outscored <span className="font-semibold text-ink">everyone</span>{' '}
        else who took the quizzes. 🏆
      </>
    );
  }
  if (beat <= 0) {
    return 'Course complete! Retake the quizzes to climb the class leaderboard.';
  }
  return (
    <>
      You outscored <span className="font-semibold text-ink">{beat}%</span> of your classmates.
    </>
  );
}
