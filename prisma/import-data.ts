import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function importData(exportPath: string) {
  console.log('Starting data import to PostgreSQL...\n');

  try {
    // Read all JSON files
    const usersData = JSON.parse(
      fs.readFileSync(path.join(exportPath, 'users.json'), 'utf-8')
    );
    const savedHomesData = JSON.parse(
      fs.readFileSync(path.join(exportPath, 'saved-homes.json'), 'utf-8')
    );
    const showingRequestsData = JSON.parse(
      fs.readFileSync(path.join(exportPath, 'showing-requests.json'), 'utf-8')
    );
    const offersData = JSON.parse(
      fs.readFileSync(path.join(exportPath, 'offers.json'), 'utf-8')
    );
    const transactionsData = JSON.parse(
      fs.readFileSync(path.join(exportPath, 'transactions.json'), 'utf-8')
    );
    const tasksData = JSON.parse(
      fs.readFileSync(path.join(exportPath, 'tasks.json'), 'utf-8')
    );
    const documentsData = JSON.parse(
      fs.readFileSync(path.join(exportPath, 'documents.json'), 'utf-8')
    );

    // Import Users first (they're referenced by other tables)
    console.log('Importing Users...');
    for (const user of usersData) {
      await prisma.user.create({
        data: {
          ...user,
          createdAt: new Date(user.createdAt),
          updatedAt: new Date(user.updatedAt),
        },
      });
    }
    console.log(`✅ Imported ${usersData.length} users`);

    // Import SavedHomes
    console.log('Importing SavedHomes...');
    for (const savedHome of savedHomesData) {
      await prisma.savedHome.create({
        data: {
          ...savedHome,
          savedAt: new Date(savedHome.savedAt),
        },
      });
    }
    console.log(`✅ Imported ${savedHomesData.length} saved homes`);

    // Import ShowingRequests
    console.log('Importing ShowingRequests...');
    for (const showing of showingRequestsData) {
      await prisma.showingRequest.create({
        data: {
          ...showing,
          preferredDate: new Date(showing.preferredDate),
          createdAt: new Date(showing.createdAt),
        },
      });
    }
    console.log(`✅ Imported ${showingRequestsData.length} showing requests`);

    // Import Offers
    console.log('Importing Offers...');
    for (const offer of offersData) {
      await prisma.offer.create({
        data: {
          ...offer,
          targetClosingDate: offer.targetClosingDate
            ? new Date(offer.targetClosingDate)
            : null,
          createdAt: new Date(offer.createdAt),
          updatedAt: new Date(offer.updatedAt),
        },
      });
    }
    console.log(`✅ Imported ${offersData.length} offers`);

    // Import Transactions
    console.log('Importing Transactions...');
    for (const transaction of transactionsData) {
      await prisma.transaction.create({
        data: {
          ...transaction,
          closingDate: transaction.closingDate
            ? new Date(transaction.closingDate)
            : null,
          actualClosingDate: transaction.actualClosingDate
            ? new Date(transaction.actualClosingDate)
            : null,
          createdAt: new Date(transaction.createdAt),
          updatedAt: new Date(transaction.updatedAt),
        },
      });
    }
    console.log(`✅ Imported ${transactionsData.length} transactions`);

    // Import Tasks
    console.log('Importing Tasks...');
    for (const task of tasksData) {
      await prisma.task.create({
        data: {
          ...task,
          dueDate: task.dueDate ? new Date(task.dueDate) : null,
          completedAt: task.completedAt ? new Date(task.completedAt) : null,
          createdAt: new Date(task.createdAt),
          updatedAt: new Date(task.updatedAt),
        },
      });
    }
    console.log(`✅ Imported ${tasksData.length} tasks`);

    // Import Documents
    console.log('Importing Documents...');
    for (const document of documentsData) {
      await prisma.document.create({
        data: {
          ...document,
          uploadedAt: new Date(document.uploadedAt),
        },
      });
    }
    console.log(`✅ Imported ${documentsData.length} documents`);

    console.log('\n✅ Import completed successfully!');
    console.log('📊 All data has been migrated to PostgreSQL');
  } catch (error) {
    console.error('❌ Error during import:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Get export path from command line argument
const exportPath = process.argv[2];

if (!exportPath) {
  console.error('❌ Please provide the export directory path as an argument');
  console.error('Example: npx tsx prisma/import-data.ts ./data-exports/export-2024-11-25');
  process.exit(1);
}

if (!fs.existsSync(exportPath)) {
  console.error(`❌ Export directory not found: ${exportPath}`);
  process.exit(1);
}

importData(exportPath);
