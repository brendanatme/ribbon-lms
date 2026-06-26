import type { QuizAuthor, QuizTake } from '@ribbon/shared';
import type { Prisma } from '@prisma/client';

/** A Quiz loaded with its ordered questions and each question's ordered options. */
export type QuizWithQuestions = Prisma.QuizGetPayload<{
  include: { questions: { include: { options: true } } };
}>;

/**
 * Teacher-facing mapping: includes the correct-answer config (`isCorrect`,
 * `correctText`, `correctNumber`) so the author can review and edit it.
 */
export function toQuizAuthor(quiz: QuizWithQuestions): QuizAuthor {
  return {
    id: quiz.id,
    lessonId: quiz.lessonId,
    title: quiz.title,
    questions: quiz.questions.map((q) => ({
      id: q.id,
      type: q.type,
      prompt: q.prompt,
      order: q.order,
      points: q.points,
      correctText: q.correctText,
      correctNumber: q.correctNumber,
      options: q.options.map((o) => ({
        id: o.id,
        text: o.text,
        isCorrect: o.isCorrect,
        order: o.order,
      })),
    })),
  };
}

/**
 * Student-facing mapping: deliberately strips every correct-answer signal
 * (`isCorrect`, `correctText`, `correctNumber`) so the quiz can be served to a
 * learner without leaking the key. Grading happens server-side at submit time.
 */
export function toQuizTake(quiz: QuizWithQuestions): QuizTake {
  return {
    id: quiz.id,
    lessonId: quiz.lessonId,
    title: quiz.title,
    questions: quiz.questions.map((q) => ({
      id: q.id,
      type: q.type,
      prompt: q.prompt,
      order: q.order,
      points: q.points,
      options: q.options.map((o) => ({ id: o.id, text: o.text, order: o.order })),
    })),
  };
}
