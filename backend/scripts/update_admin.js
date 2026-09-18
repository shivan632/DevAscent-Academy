require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PrismaNeonHttp } = require('@prisma/adapter-neon');
const bcrypt = require('bcrypt');

async function main() {
  const connectionString = process.env.DATABASE_URL;
  const adapter = new PrismaNeonHttp(connectionString, {});
  const prisma = new PrismaClient({ adapter });

  console.log('Connecting to Neon DB to update Admin user...');

  // 1. Delete old admin if exists
  await prisma.user.deleteMany({
    where: { email: 'admin@devascent.io' },
  });
  console.log('Removed old admin@devascent.io if existed.');

  // 2. Hash new password Shivan@20122005
  const passwordHash = await bcrypt.hash('Shivan@20122005', 12);

  // 3. Upsert new Admin Shivan Mishra (shivrom.2020@gmail.com)
  const admin = await prisma.user.upsert({
    where: { email: 'shivrom.2020@gmail.com' },
    update: {
      name: 'Shivan Mishra',
      passwordHash: passwordHash,
      role: 'ADMIN',
      phone: '+91 99358 06722',
      isEmailVerified: true,
    },
    create: {
      email: 'shivrom.2020@gmail.com',
      passwordHash: passwordHash,
      name: 'Shivan Mishra',
      phone: '+91 99358 06722',
      role: 'ADMIN',
      isEmailVerified: true,
    },
  });

  console.log(`✅ Admin updated successfully: ${admin.name} (${admin.email}), Role: ${admin.role}`);
  await prisma.$disconnect();
}

main().catch(console.error);
