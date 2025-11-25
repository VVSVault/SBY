import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const mockUserId = 'user-1';

  // Find the accepted offer
  const acceptedOffer = await prisma.offer.findFirst({
    where: {
      userId: mockUserId,
      status: 'accepted',
    },
  });

  if (!acceptedOffer) {
    console.log('❌ No accepted offer found. Please run seed-offers.ts first.');
    return;
  }

  // Check if transaction already exists
  const existingTransaction = await prisma.transaction.findUnique({
    where: {
      offerId: acceptedOffer.id,
    },
  });

  if (existingTransaction) {
    console.log('✅ Transaction already exists for this offer');
    return;
  }

  // Create transaction
  const transaction = await prisma.transaction.create({
    data: {
      userId: mockUserId,
      offerId: acceptedOffer.id,
      listingId: acceptedOffer.listingId,
      status: 'under_contract',
      closingDate: acceptedOffer.targetClosingDate,
    },
  });

  console.log('✅ Created transaction:', transaction.id);

  // Create default tasks
  // Tasks are organized by stage - completion of stage tasks triggers auto-advancement
  const now = new Date();
  const tasks = [
    // Stage 1: Under Contract
    {
      title: 'Send Earnest Money Deposit',
      description: 'Transfer earnest money deposit of $' + acceptedOffer.earnestMoney.toLocaleString() + ' to escrow account within 3 business days of contract acceptance.',
      dueDate: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000), // 3 days
      order: 1,
    },

    // Stage 2: Inspection Period
    {
      title: 'Schedule Home Inspection',
      description: 'Hire a licensed home inspector to evaluate the property condition. Must be completed within the inspection contingency period.',
      dueDate: new Date(now.getTime() + (acceptedOffer.inspectionDays || 10) * 24 * 60 * 60 * 1000),
      order: 2,
    },
    {
      title: 'Review Title Report',
      description: 'Review preliminary title report to ensure clear title. Address any liens, encumbrances, or title defects.',
      dueDate: new Date(now.getTime() + 21 * 24 * 60 * 60 * 1000), // 3 weeks
      order: 3,
    },

    // Stage 3: Financing
    {
      title: 'Submit Loan Application',
      description: 'Complete and submit your mortgage loan application with all required documentation (pay stubs, tax returns, bank statements).',
      dueDate: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000), // 5 days
      order: 4,
    },
    {
      title: 'Order Appraisal',
      description: 'Lender will order professional appraisal to determine property value. Must meet or exceed purchase price for loan approval.',
      dueDate: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000), // 2 weeks
      order: 5,
    },

    // Stage 4: Clear to Close
    {
      title: 'Secure Homeowner\'s Insurance',
      description: 'Obtain quotes and purchase homeowner\'s insurance policy. Lender requires proof of insurance before closing.',
      dueDate: new Date((acceptedOffer.targetClosingDate?.getTime() || now.getTime()) - 7 * 24 * 60 * 60 * 1000), // 1 week before closing
      order: 6,
    },
    {
      title: 'Review Closing Disclosure',
      description: 'Review Closing Disclosure at least 3 days before closing. Verify loan terms, closing costs, and final numbers match your expectations.',
      dueDate: new Date((acceptedOffer.targetClosingDate?.getTime() || now.getTime()) - 3 * 24 * 60 * 60 * 1000), // 3 days before closing
      order: 7,
    },
    {
      title: 'Complete Final Walkthrough',
      description: 'Conduct final walkthrough of property 24-48 hours before closing to ensure agreed-upon repairs are complete and property is in acceptable condition.',
      dueDate: new Date((acceptedOffer.targetClosingDate?.getTime() || now.getTime()) - 1 * 24 * 60 * 60 * 1000), // 1 day before closing
      order: 8,
    },
    {
      title: 'Wire Closing Funds',
      description: 'Wire transfer remaining down payment and closing costs to escrow. Verify wire instructions directly with title company.',
      dueDate: new Date((acceptedOffer.targetClosingDate?.getTime() || now.getTime()) - 1 * 24 * 60 * 60 * 1000), // 1 day before closing
      order: 9,
    },

    // Stage 5: Closed
    {
      title: 'Attend Closing',
      description: 'Attend closing appointment to sign final documents, receive keys, and officially become a homeowner!',
      dueDate: acceptedOffer.targetClosingDate || new Date(now.getTime() + 45 * 24 * 60 * 60 * 1000),
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

  console.log(`✅ Created ${tasks.length} tasks for transaction`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
