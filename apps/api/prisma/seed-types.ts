/**
 * Shared shapes for the hand-authored seed courses (PHP, WordPress, …).
 *
 * Courses are written as plain data and turned into nested Prisma
 * Course → Module → Lesson → Quiz → Question → Option rows by `seed.ts`.
 * Lesson `content` is rendered by the lesson Markdown renderer: `#` headings,
 * lists, tables, blockquotes, `inline code`, and ```fenced code blocks```.
 */

export type SeedOption = { text: string; correct?: boolean };

export type SeedQuestion =
  | { type: 'SINGLE_CHOICE'; prompt: string; options: SeedOption[]; points?: number }
  | { type: 'MULTIPLE_CHOICE'; prompt: string; options: SeedOption[]; points?: number }
  | { type: 'TEXT'; prompt: string; answer: string; points?: number }
  | { type: 'NUMBER'; prompt: string; answer: number; points?: number };

export type SeedLesson = {
  title: string;
  durationMin: number;
  content: string;
  quiz?: { title: string; questions: SeedQuestion[] };
};

export type SeedModule = { title: string; lessons: SeedLesson[] };

export type SeedCourse = {
  title: string;
  description: string;
  modules: SeedModule[];
};
