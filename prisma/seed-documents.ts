import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding documents...');

  // Get the user and transactions
  const user = await prisma.user.findFirst({
    where: { id: 'user-1' },
  });

  if (!user) {
    console.error('❌ User not found. Please run the main seed script first.');
    return;
  }

  // Get transactions to link some documents to
  const transactions = await prisma.transaction.findMany({
    where: { userId: 'user-1' },
    include: { offer: true },
  });

  const transaction1 = transactions[0];
  const transaction2 = transactions[1];

  // Create sample documents
  const documents = [
    {
      userId: 'user-1',
      transactionId: null, // General document
      fileName: 'Pre-Approval-Letter-2024.pdf',
      fileUrl: '/uploads/sample-pre-approval.pdf',
      fileSize: 245000,
      fileType: 'application/pdf',
      documentType: 'pre-approval',
      description: 'Pre-approval letter from Chase Bank for $500,000',
    },
    {
      userId: 'user-1',
      transactionId: null,
      fileName: 'Bank-Statement-December-2024.pdf',
      fileUrl: '/uploads/sample-bank-statement.pdf',
      fileSize: 1200000,
      fileType: 'application/pdf',
      documentType: 'bank-statement',
      description: 'December 2024 checking account statement',
    },
    {
      userId: 'user-1',
      transactionId: null,
      fileName: 'Drivers-License-Front.jpg',
      fileUrl: '/uploads/sample-id-front.jpg',
      fileSize: 340000,
      fileType: 'image/jpeg',
      documentType: 'id',
      description: 'Front of driver\'s license',
    },
    {
      userId: 'user-1',
      transactionId: null,
      fileName: 'Drivers-License-Back.jpg',
      fileUrl: '/uploads/sample-id-back.jpg',
      fileSize: 320000,
      fileType: 'image/jpeg',
      documentType: 'id',
      description: 'Back of driver\'s license',
    },
    {
      userId: 'user-1',
      transactionId: null,
      fileName: 'W2-2023.pdf',
      fileUrl: '/uploads/sample-w2-2023.pdf',
      fileSize: 180000,
      fileType: 'application/pdf',
      documentType: 'other',
      description: '2023 W-2 tax form',
    },
    {
      userId: 'user-1',
      transactionId: null,
      fileName: 'Pay-Stub-November-2024.pdf',
      fileUrl: '/uploads/sample-pay-stub.pdf',
      fileSize: 95000,
      fileType: 'application/pdf',
      documentType: 'other',
      description: 'November 2024 pay stub',
    },
  ];

  // Add transaction-specific documents if transactions exist
  if (transaction1) {
    documents.push(
      {
        userId: 'user-1',
        transactionId: transaction1.id,
        fileName: 'Purchase-Agreement.pdf',
        fileUrl: '/uploads/sample-purchase-agreement.pdf',
        fileSize: 890000,
        fileType: 'application/pdf',
        documentType: 'contract',
        description: 'Signed purchase agreement',
      },
      {
        userId: 'user-1',
        transactionId: transaction1.id,
        fileName: 'Home-Inspection-Report.pdf',
        fileUrl: '/uploads/sample-inspection-report.pdf',
        fileSize: 2100000,
        fileType: 'application/pdf',
        documentType: 'inspection',
        description: 'Full home inspection report with photos',
      },
      {
        userId: 'user-1',
        transactionId: transaction1.id,
        fileName: 'Appraisal-Report.pdf',
        fileUrl: '/uploads/sample-appraisal.pdf',
        fileSize: 1450000,
        fileType: 'application/pdf',
        documentType: 'appraisal',
        description: 'Professional appraisal report',
      },
      {
        userId: 'user-1',
        transactionId: transaction1.id,
        fileName: 'Homeowners-Insurance-Policy.pdf',
        fileUrl: '/uploads/sample-insurance.pdf',
        fileSize: 680000,
        fileType: 'application/pdf',
        documentType: 'insurance',
        description: 'Homeowner\'s insurance policy from State Farm',
      }
    );
  }

  if (transaction2) {
    documents.push(
      {
        userId: 'user-1',
        transactionId: transaction2.id,
        fileName: 'Purchase-Agreement-Listing-2.pdf',
        fileUrl: '/uploads/sample-purchase-agreement-2.pdf',
        fileSize: 920000,
        fileType: 'application/pdf',
        documentType: 'contract',
        description: 'Purchase agreement for second property',
      },
      {
        userId: 'user-1',
        transactionId: transaction2.id,
        fileName: 'Termite-Inspection.pdf',
        fileUrl: '/uploads/sample-termite-inspection.pdf',
        fileSize: 450000,
        fileType: 'application/pdf',
        documentType: 'inspection',
        description: 'Termite and pest inspection report',
      }
    );
  }

  // Insert documents with staggered dates
  for (let i = 0; i < documents.length; i++) {
    const daysAgo = documents.length - i; // More recent documents first
    const uploadedAt = new Date();
    uploadedAt.setDate(uploadedAt.getDate() - daysAgo);

    await prisma.document.create({
      data: {
        ...documents[i],
        uploadedAt,
      },
    });
  }

  console.log(`✅ Created ${documents.length} sample documents`);

  // Show breakdown
  const generalDocs = documents.filter(d => !d.transactionId).length;
  const transactionDocs = documents.filter(d => d.transactionId).length;
  console.log(`   - ${generalDocs} general documents`);
  console.log(`   - ${transactionDocs} transaction-specific documents`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding documents:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
