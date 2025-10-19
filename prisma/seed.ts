//use the Prisma Client to create some records

//import { PrismaClient } from '@prisma/client';
import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create 1 fake user
  const user = await prisma.user.create({
    data: {
      email: 'testuser@example.com',
      name: 'Test User',
      address: '123 Seed Street'
    }
  });

  // Insert a few fake Result rows
  for (let i = 0; i < 3; i++) {
    const theta1_init = Math.random() * Math.PI;
    const theta2_init = Math.random() * Math.PI;
    const theta3_init = Math.random() * Math.PI;

    // Create fake time series
    const steps = 50;
    const time = Array.from({ length: steps }, (_, idx) => idx * 0.1);
    const theta1_series = time.map(t => theta1_init + 0.05 * Math.sin(t));
    const theta2_series = time.map(t => theta2_init + 0.05 * Math.cos(t));
    const theta3_series = time.map(t => theta3_init + 0.03 * Math.sin(2 * t));

    // Fake cartesian data
    const x1 = theta1_series.map(theta => Math.sin(theta));
    const y1 = theta1_series.map(theta => -Math.cos(theta));
    const x2 = theta2_series.map(theta => Math.sin(theta));
    const y2 = theta2_series.map(theta => -Math.cos(theta));
    const x3 = theta3_series.map(theta => Math.sin(theta));
    const y3 = theta3_series.map(theta => -Math.cos(theta));

    // Create result
    await prisma.result.create({
      data: {
        theta1_init,
        theta2_init,
        theta3_init,
        theta1_series,
        theta2_series,
        theta3_series,
        time,
        x1,
        y1,
        x2,
        y2,
        x3,
        y3,
        userId: user.id,
      },
    });
  }

  console.log('✅ Done seeding.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
