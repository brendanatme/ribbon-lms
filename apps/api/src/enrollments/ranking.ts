/**
 * Where a student's score lands within their cohort. Pure (no I/O) so it can be
 * unit-tested in isolation, mirroring `quizzes/grading.ts`.
 *
 * `rank` is 1-based with ties sharing the best position (two top scorers are both
 * rank 1). `percentile` is the share of the cohort — including the student — that
 * scored at or below them, so the top scorer is always 100.
 */
export function rankInCohort(
  myAverage: number,
  cohortAverages: number[],
): { rank: number; percentile: number } {
  const cohortSize = cohortAverages.length;
  if (cohortSize === 0) return { rank: 0, percentile: 0 };

  const better = cohortAverages.filter((avg) => avg > myAverage).length;
  const atOrBelow = cohortAverages.filter((avg) => avg <= myAverage).length;
  return {
    rank: better + 1,
    percentile: Math.round((atOrBelow / cohortSize) * 100),
  };
}
