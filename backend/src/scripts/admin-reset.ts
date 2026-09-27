import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const prisma = new PrismaClient();

async function main() {
  const email = process.env.SUPER_ADMIN_EMAIL || 'shivrom.2020@gmail.com';
  const defaultPassword = process.env.ADMIN_PASSWORD || 'Shivan@20122005';

  console.log(`[Admin Recovery] Checking account for: ${email}`);

  const hashedPassword = await bcrypt.hash(defaultPassword, 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      role: 'ADMIN',
      status: 'ACTIVE',
      passwordHash: hashedPassword,
    },
    create: {
      email,
      name: 'Super Admin',
      passwordHash: hashedPassword,
      role: 'ADMIN',
      status: 'ACTIVE',
    },

  });

  console.log(`[Admin Recovery] Successfully restored ADMIN access for: ${user.email} (Role: ${user.role}, Status: ${user.status})`);
}

main()
  .catch((e) => {
    console.error('[Admin Recovery] Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
