import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const mockUserId = 'user-1';

  // Find the countered offer to create a transaction for
  const counteredOffer = await prisma.offer.findFirst({
    where: {
      userId: mockUserId,
      status: 'countered',
    },
  });

  if (!counteredOffer) {
    console.log('❌ No countered offer found. Please run seed-offers.ts first.');
    return;
  }

  // First, update the offer to accepted
  await prisma.offer.update({
    where: { id: counteredOffer.id },
    data: { status: 'accepted' },
  });

  console.log('✅ Updated countered offer to accepted');

  // Create transaction in financing stage
  const transaction = await prisma.transaction.create({
    data: {
      userId: mockUserId,
      offerId: counteredOffer.id,
      listingId: counteredOffer.listingId,
      status: 'financing', // This is the key - setting it to financing stage
      closingDate: counteredOffer.targetClosingDate,
    },
  });

  console.log('✅ Created transaction in financing stage:', transaction.id);

  // Create tasks with some already completed
  // This transaction is in FINANCING stage, so we've completed Under Contract and Inspection Period tasks
  const now = new Date();
  const tasks = [
    // Stage 1: Under Contract - COMPLETED
    {
      title: 'Send Earnest Money Deposit',
      description: 'Transfer earnest money deposit of $' + counteredOffer.earnestMoney.toLocaleString() + ' to escrow account within 3 business days of contract acceptance.',
      dueDate: new Date(now.getTime() - 25 * 24 * 60 * 60 * 1000), // 25 days ago
      completed: true, // COMPLETED
      completedAt: new Date(now.getTime() - 26 * 24 * 60 * 60 * 1000),
      order: 1,
    },

    // Stage 2: Inspection Period - COMPLETED
    {
      title: 'Schedule Home Inspection',
      description: 'Hire a licensed home inspector to evaluate the property condition. Must be completed within the inspection contingency period.',
      dueDate: new Date(now.getTime() - 18 * 24 * 60 * 60 * 1000), // 18 days ago
      completed: true, // COMPLETED
      completedAt: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000),
      order: 2,
    },
    {
      title: 'Review Title Report',
      description: 'Review preliminary title report to ensure clear title. Address any liens, encumbrances, or title defects.',
      dueDate: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
      completed: true, // COMPLETED
      completedAt: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000),
      order: 3,
    },

    // Stage 3: Financing - CURRENT STAGE (1 of 2 complete)
    {
      title: 'Submit Loan Application',
      description: 'Complete and submit your mortgage loan application with all required documentation (pay stubs, tax returns, bank statements).',
      dueDate: new Date(now.getTime() - 23 * 24 * 60 * 60 * 1000), // 23 days ago
      completed: true, // COMPLETED
      completedAt: new Date(now.getTime() - 24 * 24 * 60 * 60 * 1000),
      order: 4,
    },
    {
      title: 'Order Appraisal',
      description: 'Lender will order professional appraisal to determine property value. Must meet or exceed purchase price for loan approval.',
      dueDate: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000), // 2 days from now - CURRENT TASK
      completed: false, // Not done - need this to auto-advance
      order: 5,
    },

    // Stage 4: Clear to Close - PENDING
    {
      title: 'Secure Homeowner\'s Insurance',
      description: 'Obtain quotes and purchase homeowner\'s insurance policy. Lender requires proof of insurance before closing.',
      dueDate: new Date((counteredOffer.targetClosingDate?.getTime() || now.getTime()) - 7 * 24 * 60 * 60 * 1000), // 1 week before closing
      completed: false,
      order: 6,
    },
    {
      title: 'Review Closing Disclosure',
      description: 'Review Closing Disclosure at least 3 days before closing. Verify loan terms, closing costs, and final numbers match your expectations.',
      dueDate: new Date((counteredOffer.targetClosingDate?.getTime() || now.getTime()) - 3 * 24 * 60 * 60 * 1000), // 3 days before closing
      completed: false,
      order: 7,
    },
    {
      title: 'Complete Final Walkthrough',
      description: 'Conduct final walkthrough of property 24-48 hours before closing to ensure agreed-upon repairs are complete and property is in acceptable condition.',
      dueDate: new Date((counteredOffer.targetClosingDate?.getTime() || now.getTime()) - 1 * 24 * 60 * 60 * 1000), // 1 day before closing
      completed: false,
      order: 8,
    },
    {
      title: 'Wire Closing Funds',
      description: 'Wire transfer remaining down payment and closing costs to escrow. Verify wire instructions directly with title company.',
      dueDate: new Date((counteredOffer.targetClosingDate?.getTime() || now.getTime()) - 1 * 24 * 60 * 60 * 1000), // 1 day before closing
      completed: false,
      order: 9,
    },

    // Stage 5: Closed - PENDING
    {
      title: 'Attend Closing',
      description: 'Attend closing appointment to sign final documents, receive keys, and officially become a homeowner!',
      dueDate: counteredOffer.targetClosingDate || new Date(now.getTime() + 45 * 24 * 60 * 60 * 1000),
      completed: false,
      order: 10,
    },
  ];

  for (const taskData of tasks) {
    await prisma.task.create({
      data: {
        ...taskData,
        transactionId: transaction.id,
      },
    });
  }

  console.log(`✅ Created ${tasks.length} tasks (4 completed, 6 pending)`);
  console.log('📊 Transaction Status: Financing Stage');
  console.log('   - Under Contract: ✓ Completed');
  console.log('   - Inspection Period: ✓ Completed');
  console.log('   - Financing: 🔄 Current Stage');
  console.log('   - Clear to Close: Pending');
  console.log('   - Closed: Pending');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
