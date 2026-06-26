import { useQuery } from '@tanstack/react-query';
import { quizResultsQuery } from '@/lib/queries';

/** Read-only roster of each enrolled student's best score on a lesson's quiz. */
export function QuizResultsPanel({ lessonId }: { lessonId: string }) {
  const { data, isLoading } = useQuery(quizResultsQuery(lessonId));

  if (isLoading || !data) return null;
  if (data.results.length === 0) {
    return <p className="text-sm text-ink/40">No students enrolled yet.</p>;
  }

  return (
    <div>
      <h4 className="mb-2 text-sm font-semibold uppercase tracking-wide text-ink/50">
        Student results
      </h4>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-ink/50">
            <th className="py-1 font-medium">Student</th>
            <th className="py-1 font-medium">Best score</th>
            <th className="py-1 font-medium">Attempts</th>
          </tr>
        </thead>
        <tbody>
          {data.results.map((r) => (
            <tr key={r.studentId} className="border-t border-ink/10">
              <td className="py-1">{r.studentName}</td>
              <td className="py-1">{r.bestScore == null ? '—' : `${r.bestScore}%`}</td>
              <td className="py-1 text-ink/60">{r.attemptCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
