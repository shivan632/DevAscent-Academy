import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const prisma = new PrismaClient();

const adminsToAdd = [
  {
    name: 'Prakhar Srivastava',
    email: 'prakharcodes66@gmail.com',
    password: 'Prakhar@15062005',
  },
  {
    name: 'Tushar Singh',
    email: 'ts200521@gmail.com',
    password: 'Tushar@21042005',
  },
  {
    name: 'Prakarsh Chauhan',
    email: 'vikramprakarsh@gmail.com',
    password: 'Prakarsh@03122005',
  },
];

async function main() {
  console.log('[Add Admins] Starting admin provisioning...');

  for (const admin of adminsToAdd) {
    const hashedPassword = await bcrypt.hash(admin.password, 12);

    const user = await prisma.user.upsert({
      where: { email: admin.email },
      update: {
        name: admin.name,
        role: 'ADMIN',
        status: 'ACTIVE',
        isEmailVerified: true,
        passwordHash: hashedPassword,
      },
      create: {
        email: admin.email,
        name: admin.name,
        passwordHash: hashedPassword,
        role: 'ADMIN',
        status: 'ACTIVE',
        isEmailVerified: true,
      },
    });

    console.log(`[Add Admins] Configured ADMIN: ${user.name} <${user.email}> (Role: ${user.role}, Status: ${user.status}, Verified: ${user.isEmailVerified})`);
  }

  // List all admins in the system
  const allAdmins = await prisma.user.findMany({
    where: { role: 'ADMIN' },
    select: { id: true, name: true, email: true, role: true, status: true, isEmailVerified: true, createdAt: true },
  });

  console.log('\n--- Current System Admins ---');
  allAdmins.forEach((a, index) => {
    console.log(`${index + 1}. ${a.name} | ${a.email} | Role: ${a.role} | Status: ${a.status}`);
  });
}

main()
  .catch((e) => {
    console.error('[Add Admins] Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
