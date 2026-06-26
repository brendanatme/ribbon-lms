import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

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
