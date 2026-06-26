import { z } from 'zod';
import { QuestionType, questionTypeSchema } from './enums.js';

/* -------------------------------------------------------------------------- */
/* Authoring (teacher) input                                                   */
/* -------------------------------------------------------------------------- */

export const upsertOptionSchema = z.object({
  text: z.string().min(1).max(500),
  isCorrect: z.boolean().default(false),
  order: z.number().int().min(0).default(0),
});
export type UpsertOptionInput = z.infer<typeof upsertOptionSchema>;

export const upsertQuestionSchema = z
  .object({
    type: questionTypeSchema,
    prompt: z.string().min(1).max(2000),
    order: z.number().int().min(0).default(0),
    points: z.number().int().min(1).max(100).default(1),
    options: z.array(upsertOptionSchema).default([]),
    correctText: z.string().max(500).nullish(),
    correctNumber: z.number().nullish(),
  })
  .superRefine((q, ctx) => {
    const isChoice =
      q.type === QuestionType.SINGLE_CHOICE || q.type === QuestionType.MULTIPLE_CHOICE;
    if (isChoice) {
      if (q.options.length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['options'],
          message: 'Choice questions need at least 2 options',
        });
      }
      const correct = q.options.filter((o) => o.isCorrect).length;
      if (correct < 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['options'],
          message: 'Mark at least one option correct',
        });
      }
      if (q.type === QuestionType.SINGLE_CHOICE && correct > 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['options'],
          message: 'Single-choice questions allow only one correct option',
        });
      }
    }
    if (q.type === QuestionType.TEXT && !q.correctText?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['correctText'],
        message: 'Provide the accepted answer',
      });
    }
    if (q.type === QuestionType.NUMBER && q.correctNumber == null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['correctNumber'],
        message: 'Provide the correct number',
      });
    }
  });
export type UpsertQuestionInput = z.infer<typeof upsertQuestionSchema>;

export const upsertQuizSchema = z.object({
  title: z.string().max(200).default(''),
  questions: z.array(upsertQuestionSchema).min(1).max(50),
});
export type UpsertQuizInput = z.infer<typeof upsertQuizSchema>;

/* -------------------------------------------------------------------------- */
/* Author view DTO (teacher) — includes correct answers                        */
/* -------------------------------------------------------------------------- */

export const quizAuthorOptionSchema = z.object({
  id: z.string(),
  text: z.string(),
  isCorrect: z.boolean(),
  order: z.number(),
});

export const quizAuthorQuestionSchema = z.object({
  id: z.string(),
  type: questionTypeSchema,
  prompt: z.string(),
  order: z.number(),
  points: z.number(),
  options: z.array(quizAuthorOptionSchema),
  correctText: z.string().nullable(),
  correctNumber: z.number().nullable(),
});

export const quizAuthorSchema = z.object({
  id: z.string(),
  lessonId: z.string(),
  title: z.string(),
  questions: z.array(quizAuthorQuestionSchema),
});
export type QuizAuthor = z.infer<typeof quizAuthorSchema>;

/* -------------------------------------------------------------------------- */
/* Take view DTO (student) — correct answers stripped out                      */
/* -------------------------------------------------------------------------- */

export const quizTakeOptionSchema = z.object({
  id: z.string(),
  text: z.string(),
  order: z.number(),
});

export const quizTakeQuestionSchema = z.object({
  id: z.string(),
  type: questionTypeSchema,
  prompt: z.string(),
  order: z.number(),
  points: z.number(),
  options: z.array(quizTakeOptionSchema),
});

export const quizTakeSchema = z.object({
  id: z.string(),
  lessonId: z.string(),
  title: z.string(),
  questions: z.array(quizTakeQuestionSchema),
});
export type QuizTake = z.infer<typeof quizTakeSchema>;

/* -------------------------------------------------------------------------- */
/* Submitting an attempt (student) + result                                    */
/* -------------------------------------------------------------------------- */

export const submitAnswerSchema = z.object({
  questionId: z.string(),
  selectedOptionIds: z.array(z.string()).default([]),
  textValue: z.string().nullish(),
  numberValue: z.number().nullish(),
});
export type SubmitAnswerInput = z.infer<typeof submitAnswerSchema>;

export const submitAttemptSchema = z.object({
  answers: z.array(submitAnswerSchema),
});
export type SubmitAttemptInput = z.infer<typeof submitAttemptSchema>;

export const attemptAnswerResultSchema = z.object({
  questionId: z.string(),
  isCorrect: z.boolean(),
});

export const attemptResultSchema = z.object({
  attemptId: z.string(),
  quizId: z.string(),
  score: z.number(),
  pointsEarned: z.number(),
  pointsPossible: z.number(),
  submittedAt: z.string(),
  answers: z.array(attemptAnswerResultSchema),
});
export type AttemptResult = z.infer<typeof attemptResultSchema>;

/** A student's best attempt at a quiz, surfaced in the player and learning list. */
export const quizAttemptSummarySchema = z.object({
  quizId: z.string(),
  lessonId: z.string(),
  bestScore: z.number(),
  attemptCount: z.number(),
  lastAttemptAt: z.string(),
});
export type QuizAttemptSummary = z.infer<typeof quizAttemptSummarySchema>;

/* -------------------------------------------------------------------------- */
/* Teacher results roster                                                       */
/* -------------------------------------------------------------------------- */

export const studentQuizResultSchema = z.object({
  studentId: z.string(),
  studentName: z.string(),
  bestScore: z.number().nullable(),
  attemptCount: z.number(),
  lastAttemptAt: z.string().nullable(),
});

export const quizResultsSchema = z.object({
  quizId: z.string(),
  lessonId: z.string(),
  title: z.string(),
  results: z.array(studentQuizResultSchema),
});
export type QuizResults = z.infer<typeof quizResultsSchema>;
