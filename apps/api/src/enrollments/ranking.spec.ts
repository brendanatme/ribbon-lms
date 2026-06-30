import { describe, it, expect } from 'vitest';
import { rankInCohort } from './ranking';

describe('rankInCohort', () => {
  it('ranks the top scorer #1 at the 100th percentile', () => {
    expect(rankInCohort(95, [74, 86, 95])).toEqual({ rank: 1, percentile: 100 });
  });

  it('ranks a middle scorer correctly', () => {
    expect(rankInCohort(86, [74, 86, 95])).toEqual({ rank: 2, percentile: 67 });
  });

  it('ranks the lowest scorer last', () => {
    expect(rankInCohort(74, [74, 86, 95])).toEqual({ rank: 3, percentile: 33 });
  });

  it('gives tied top scorers the same rank 1', () => {
    expect(rankInCohort(90, [90, 90, 50]).rank).toBe(1);
  });

  it('handles a lone learner', () => {
    expect(rankInCohort(80, [80])).toEqual({ rank: 1, percentile: 100 });
  });

  it('returns zeros for an empty cohort', () => {
    expect(rankInCohort(80, [])).toEqual({ rank: 0, percentile: 0 });
  });
});
