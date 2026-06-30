import { PrismaClient, Prisma } from '@prisma/client';
import * as argon2 from 'argon2';
import { phpCourse, type SeedCourse, type SeedQuestion } from './php-course';

const prisma = new PrismaClient();

/** Turns a flat SeedQuestion into the nested Prisma create shape. */
function buildQuestion(q: SeedQuestion, order: number): Prisma.QuestionCreateWithoutQuizInput {
  const base = { prompt: q.prompt, order, points: q.points ?? 1 };
  switch (q.type) {
    case 'SINGLE_CHOICE':
    case 'MULTIPLE_CHOICE':
      return {
        ...base,
        type: q.type,
        options: {
          create: q.options.map((o, i) => ({
            text: o.text,
            isCorrect: o.correct ?? false,
            order: i,
          })),
        },
      };
    case 'TEXT':
      return { ...base, type: 'TEXT', correctText: q.answer };
    case 'NUMBER':
      return { ...base, type: 'NUMBER', correctNumber: q.answer };
  }
}

/** Seeds a whole SeedCourse (modules → lessons → quizzes) for a teacher. */
async function seedCourse(course: SeedCourse, teacherId: string) {
  const existing = await prisma.course.findFirst({ where: { title: course.title } });
  if (existing) return;

  await prisma.course.create({
    data: {
      title: course.title,
      description: course.description,
      teacherId,
      published: true,
      modules: {
        create: course.modules.map((mod, mIdx) => ({
          title: mod.title,
          order: mIdx,
          lessons: {
            create: mod.lessons.map((lesson, lIdx) => ({
              title: lesson.title,
              content: lesson.content,
              order: lIdx,
              durationMin: lesson.durationMin,
              ...(lesson.quiz
                ? {
                    quiz: {
                      create: {
                        title: lesson.quiz.title,
                        questions: {
                          create: lesson.quiz.questions.map((q, qIdx) => buildQuestion(q, qIdx)),
                        },
                      },
                    },
                  }
                : {}),
            })),
          },
        })),
      },
    },
  });
}

async function main() {
  const password = await argon2.hash('Password123!');

  const admin = await prisma.user.upsert({
    where: { email: 'admin@ribbon.dev' },
    update: {},
    create: { email: 'admin@ribbon.dev', name: 'Ada Admin', passwordHash: password, role: 'ADMIN' },
  });

  const teacher = await prisma.user.upsert({
    where: { email: 'teacher@ribbon.dev' },
    update: {},
    create: {
      email: 'teacher@ribbon.dev',
      name: 'Theo Teacher',
      passwordHash: password,
      role: 'TEACHER',
    },
  });

  await prisma.user.upsert({
    where: { email: 'student@ribbon.dev' },
    update: {},
    create: {
      email: 'student@ribbon.dev',
      name: 'Sam Student',
      passwordHash: password,
      role: 'STUDENT',
    },
  });

  await prisma.user.upsert({
    where: { email: 'student2@ribbon.dev' },
    update: {},
    create: {
      email: 'student2@ribbon.dev',
      name: 'Nia Novice',
      passwordHash: password,
      role: 'STUDENT',
    },
  });

  // Sample published course with modules + lessons
  const existing = await prisma.course.findFirst({ where: { title: 'Intro to TypeScript' } });
  if (!existing) {
    await prisma.course.create({
      data: {
        title: 'Intro to TypeScript',
        description: 'Learn the fundamentals of TypeScript from the ground up.',
        teacherId: teacher.id,
        published: true,
        modules: {
          create: [
            {
              title: 'Getting Started',
              order: 0,
              lessons: {
                create: [
                  {
                    title: 'Why TypeScript?',
                    content: 'TypeScript adds static types to JavaScript.',
                    order: 0,
                    durationMin: 6,
                    quiz: {
                      create: {
                        title: 'Why TypeScript? — quick check',
                        questions: {
                          create: [
                            {
                              type: 'SINGLE_CHOICE',
                              prompt: 'What does TypeScript add to JavaScript?',
                              order: 0,
                              points: 1,
                              options: {
                                create: [
                                  { text: 'Static types', isCorrect: true, order: 0 },
                                  { text: 'A new runtime', isCorrect: false, order: 1 },
                                  { text: 'A database', isCorrect: false, order: 2 },
                                ],
                              },
                            },
                            {
                              type: 'TEXT',
                              prompt:
                                'What file extension do TypeScript files use? (incl. the dot)',
                              order: 1,
                              points: 1,
                              correctText: '.ts',
                            },
                          ],
                        },
                      },
                    },
                  },
                  {
                    title: 'Setting Up Your Environment',
                    content: 'Install Node and the TypeScript compiler.',
                    order: 1,
                    durationMin: 8,
                  },
                ],
              },
            },
            {
              title: 'Core Types',
              order: 1,
              lessons: {
                create: [
                  {
                    title: 'Primitives and Inference',
                    content: 'string, number, boolean, and inference.',
                    order: 0,
                    durationMin: 10,
                  },
                  {
                    title: 'Interfaces and Types',
                    content: 'Modeling object shapes.',
                    order: 1,
                    durationMin: 12,
                  },
                ],
              },
            },
          ],
        },
      },
    });
  }

  await seedCourse(phpCourse, teacher.id);

  console.log(`Seeded. Admin: ${admin.email} / Password123!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
