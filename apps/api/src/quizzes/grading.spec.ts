import { describe, it, expect } from 'vitest';
import { QuestionType } from '@ribbon/shared';
import { gradeQuestion } from './grading';
import type { QuizWithQuestions } from '@/common/mappers/quiz.mapper';

type Q = QuizWithQuestions['questions'][number];

/** Builds a minimal Question row for grading; only the fields used are set. */
function question(partial: Partial<Q>): Q {
  return {
    id: 'q1',
    quizId: 'quiz1',
    type: QuestionType.SINGLE_CHOICE,
    prompt: '',
    order: 0,
    points: 1,
    correctText: null,
    correctNumber: null,
    options: [],
    ...partial,
  } as Q;
}

function option(id: string, isCorrect: boolean): Q['options'][number] {
  return { id, questionId: 'q1', text: id, isCorrect, order: 0 };
}

describe('gradeQuestion', () => {
  it('treats a missing answer as incorrect', () => {
    expect(gradeQuestion(question({}), undefined)).toBe(false);
  });

  describe('single choice', () => {
    const q = question({
      type: QuestionType.SINGLE_CHOICE,
      options: [option('a', true), option('b', false)],
    });
    it('is correct when the one right option is selected', () => {
      expect(gradeQuestion(q, { selectedOptionIds: ['a'] })).toBe(true);
    });
    it('is incorrect for the wrong option', () => {
      expect(gradeQuestion(q, { selectedOptionIds: ['b'] })).toBe(false);
    });
  });

  describe('multiple choice', () => {
    const q = question({
      type: QuestionType.MULTIPLE_CHOICE,
      options: [option('a', true), option('b', true), option('c', false)],
    });
    it('requires the exact set of correct options', () => {
      expect(gradeQuestion(q, { selectedOptionIds: ['a', 'b'] })).toBe(true);
    });
    it('is incorrect when a correct option is missing', () => {
      expect(gradeQuestion(q, { selectedOptionIds: ['a'] })).toBe(false);
    });
    it('is incorrect when an extra wrong option is included', () => {
      expect(gradeQuestion(q, { selectedOptionIds: ['a', 'b', 'c'] })).toBe(false);
    });
  });

  describe('text', () => {
    const q = question({ type: QuestionType.TEXT, correctText: 'Paris' });
    it('matches case-insensitively and trims whitespace', () => {
      expect(gradeQuestion(q, { selectedOptionIds: [], textValue: '  paris ' })).toBe(true);
    });
    it('rejects a different answer', () => {
      expect(gradeQuestion(q, { selectedOptionIds: [], textValue: 'London' })).toBe(false);
    });
  });

  describe('number', () => {
    const q = question({ type: QuestionType.NUMBER, correctNumber: 42 });
    it('matches the exact number', () => {
      expect(gradeQuestion(q, { selectedOptionIds: [], numberValue: 42 })).toBe(true);
    });
    it('rejects a different number', () => {
      expect(gradeQuestion(q, { selectedOptionIds: [], numberValue: 41 })).toBe(false);
    });
  });
});
