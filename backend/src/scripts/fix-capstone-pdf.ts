/**
 * fix-capstone-pdf.ts
 * 
 * One-shot DB fix:
 * 1. Nulls out exercisePdfUrl/exercisePdfTitle from all non-capstone lesson topics
 * 2. Updates the capstone lesson (lesson 3.5) with the correct Web Development Project PDF link
 * 
 * Run: npx ts-node -r tsconfig-paths/register src/scripts/fix-capstone-pdf.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const NEW_CAPSTONE_PDF_URL =
  'https://drive.google.com/file/d/1dtrV7i90kKfAumqe0kLSfgYdYFJmevbk/preview';
const NEW_CAPSTONE_PDF_TITLE =
  'Official Capstone Submission Rubric & GitHub Guidelines PDF';

async function main() {
  console.log('🔧 Starting capstone PDF fix...\n');

  // 1. Find the capstone lesson (contains "Capstone Architecture" or "Capstone" in title and is the last lesson)
  const capstoneLessons = await prisma.lesson.findMany({
    where: {
      title: {
        contains: 'Capstone Architecture',
      },
    },
    select: {
      id: true,
      title: true,
      lessonNumber: true,
      exercisePdfUrl: true,
      module: {
        select: {
          title: true,
          course: { select: { title: true, slug: true } },
        },
      },
    },
  });

  console.log(`Found ${capstoneLessons.length} capstone lesson(s):`);
  for (const l of capstoneLessons) {
    console.log(`  - [${l.id}] "${l.title}" in module "${l.module.title}" (${l.module.course.slug})`);
  }

  const capstoneIds = capstoneLessons.map((l) => l.id);

  // 2. Null out exercisePdfUrl for ALL lessons that have the OLD PDF URL (non-capstone ones)
  const nullResult = await prisma.lesson.updateMany({
    where: {
      exercisePdfUrl: {
        contains: '1gMEpJdwkUGD6s8k_-iafwSjOkuxvmJVy',
      },
      id: { notIn: capstoneIds },
    },
    data: {
      exercisePdfUrl: null,
      exercisePdfTitle: null,
    },
  });

  console.log(`\n✅ Nulled exercisePdfUrl for ${nullResult.count} non-capstone lesson(s).`);

  // 3. Update capstone lessons with the new PDF URL
  let updatedCapstone = 0;
  for (const lesson of capstoneLessons) {
    await prisma.lesson.update({
      where: { id: lesson.id },
      data: {
        exercisePdfUrl: NEW_CAPSTONE_PDF_URL,
        exercisePdfTitle: NEW_CAPSTONE_PDF_TITLE,
      },
    });
    updatedCapstone++;
    console.log(`✅ Updated capstone lesson "${lesson.title}" with new PDF URL.`);
  }

  // 4. Final verification
  const remaining = await prisma.lesson.count({
    where: {
      exercisePdfUrl: { not: null },
    },
  });

  console.log(`\n📊 Verification: ${remaining} lesson(s) now have an exercisePdfUrl set (should be ${capstoneIds.length}).`);

  if (remaining !== capstoneIds.length) {
    console.warn('⚠️  Mismatch! Some unexpected lessons still have a PDF URL. Manual check needed.');

    const extras = await prisma.lesson.findMany({
      where: {
        exercisePdfUrl: { not: null },
        id: { notIn: capstoneIds },
      },
      select: { id: true, title: true, exercisePdfUrl: true },
    });

    for (const e of extras) {
      console.warn(`  Extra: [${e.id}] "${e.title}" — ${e.exercisePdfUrl}`);
    }
  } else {
    console.log('\n🎉 Fix completed successfully! Project PDF now only appears on the Capstone page.');
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
