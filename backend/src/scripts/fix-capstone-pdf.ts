/**
 * fix-capstone-pdf.ts
 * 
 * Sets the Course.projectPdfUrl for Web Development Virtual Internship
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const NEW_CAPSTONE_PDF_URL =
  'https://drive.google.com/file/d/1dtrV7i90kKfAumqe0kLSfgYdYFJmevbk/preview';
const NEW_CAPSTONE_PDF_TITLE =
  'Web Development Virtual Internship — Capstone Project Blueprint';

async function main() {
  console.log('🔧 Updating course project PDF...\n');

  const course = await prisma.course.updateMany({
    where: { slug: 'web-development-internship' },
    data: {
      projectPdfUrl: NEW_CAPSTONE_PDF_URL,
      projectPdfTitle: NEW_CAPSTONE_PDF_TITLE,
      projectUploadedAt: new Date(),
    },
  });

  console.log('✅ Course project updated:', course);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
