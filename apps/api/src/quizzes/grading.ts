import { QuestionType } from '@ribbon/shared';
import type { QuizWithQuestions } from '@/common/mappers/quiz.mapper';

type GradedQuestion = QuizWithQuestions['questions'][number];

export interface SubmittedAnswer {
  selectedOptionIds: string[];
  textValue?: string | null;
  numberValue?: number | null;
}

/** Case-insensitive, whitespace-trimmed comparison for TEXT answers. */
const normalize = (s: string) => s.trim().toLowerCase();

/**
 * Auto-grades a single answer against its question. Pure (no I/O) so it can be
 * unit-tested in isolation. Choice questions require an exact set match against
 * the options flagged `isCorrect`; TEXT is a normalized string match; NUMBER is
 * strict equality.
 */
export function gradeQuestion(
  question: GradedQuestion,
  answer: SubmittedAnswer | undefined,
): boolean {
  if (!answer) return false;

  switch (question.type) {
    case QuestionType.SINGLE_CHOICE:
    case QuestionType.MULTIPLE_CHOICE: {
      const correct = new Set(question.options.filter((o) => o.isCorrect).map((o) => o.id));
      const selected = new Set(answer.selectedOptionIds);
      if (correct.size !== selected.size) return false;
      for (const id of correct) if (!selected.has(id)) return false;
      return true;
    }
    case QuestionType.TEXT:
      return (
        answer.textValue != null &&
        question.correctText != null &&
        normalize(answer.textValue) === normalize(question.correctText)
      );
    case QuestionType.NUMBER:
      return (
        answer.numberValue != null &&
        question.correctNumber != null &&
        answer.numberValue === question.correctNumber
      );
    default:
      return false;
  }
}
