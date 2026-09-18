require('dotenv').config();
const { neonConfig } = require('@neondatabase/serverless');
const { PrismaNeon, PrismaNeonHttp } = require('@prisma/adapter-neon');
const { PrismaClient } = require('@prisma/client');
const ws = require('ws');

neonConfig.webSocketConstructor = ws;

async function testPrismaAdapters() {
  const connectionString = process.env.DATABASE_URL;
  console.log('DATABASE_URL exists:', Boolean(connectionString));
  console.log('DATABASE_URL length:', connectionString?.length);

  if (!connectionString) {
    throw new Error('DATABASE_URL is missing from .env');
  }

  console.log('\n--- 1. Testing PrismaNeonHttp (Stateless HTTP - Recommended) ---');
  try {
    const httpAdapter = new PrismaNeonHttp(connectionString, {});
    const prismaHttp = new PrismaClient({ adapter: httpAdapter });
    const userCount = await prismaHttp.user.count();
    const courseCount = await prismaHttp.course.count();
    console.log(`✅ PrismaNeonHttp SUCCESS! Users: ${userCount}, Courses: ${courseCount}`);
    await prismaHttp.$disconnect();
  } catch (e) {
    console.error('❌ PrismaNeonHttp ERROR:', e.message || e);
  }

  console.log('\n--- 2. Testing PrismaNeon (WebSocket / Pool Config) ---');
  try {
    const poolAdapter = new PrismaNeon({ connectionString });
    const prismaPool = new PrismaClient({ adapter: poolAdapter });
    const userCount = await prismaPool.user.count();
    const courseCount = await prismaPool.course.count();
    console.log(`✅ PrismaNeon (WebSocket/Pool) SUCCESS! Users: ${userCount}, Courses: ${courseCount}`);
    await prismaPool.$disconnect();
  } catch (e) {
    console.error('❌ PrismaNeon (WebSocket/Pool) ERROR:', e.message || e);
  }
}

testPrismaAdapters();
