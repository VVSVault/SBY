import { prisma } from '../lib/prisma';

async function main() {
  // Create a test user
  const user = await prisma.user.upsert({
    where: { email: 'john.doe@example.com' },
    update: {},
    create: {
      id: 'user-1',
      email: 'john.doe@example.com',
      name: 'John Doe',
      phone: '(555) 123-4567',
      role: 'buyer',
    },
  });

  console.log('Seeded user:', user);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
