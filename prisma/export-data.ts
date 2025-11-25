import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function exportData() {
  console.log('Starting data export from SQLite...\n');

  try {
    // Create exports directory
    const exportDir = path.join(process.cwd(), 'data-exports');
    if (!fs.existsSync(exportDir)) {
      fs.mkdirSync(exportDir);
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const exportPath = path.join(exportDir, `export-${timestamp}`);
    fs.mkdirSync(exportPath);

    // Export SavedHomes
    console.log('Exporting SavedHomes...');
    const savedHomes = await prisma.savedHome.findMany();
    fs.writeFileSync(
      path.join(exportPath, 'saved-homes.json'),
      JSON.stringify(savedHomes, null, 2)
    );
    console.log(`✅ Exported ${savedHomes.length} saved homes`);

    // Export ShowingRequests
    console.log('Exporting ShowingRequests...');
    const showingRequests = await prisma.showingRequest.findMany();
    fs.writeFileSync(
      path.join(exportPath, 'showing-requests.json'),
      JSON.stringify(showingRequests, null, 2)
    );
    console.log(`✅ Exported ${showingRequests.length} showing requests`);

    // Export Offers
    console.log('Exporting Offers...');
    const offers = await prisma.offer.findMany();
    fs.writeFileSync(
      path.join(exportPath, 'offers.json'),
      JSON.stringify(offers, null, 2)
    );
    console.log(`✅ Exported ${offers.length} offers`);

    // Export Transactions
    console.log('Exporting Transactions...');
    const transactions = await prisma.transaction.findMany();
    fs.writeFileSync(
      path.join(exportPath, 'transactions.json'),
      JSON.stringify(transactions, null, 2)
    );
    console.log(`✅ Exported ${transactions.length} transactions`);

    // Export Tasks
    console.log('Exporting Tasks...');
    const tasks = await prisma.task.findMany();
    fs.writeFileSync(
      path.join(exportPath, 'tasks.json'),
      JSON.stringify(tasks, null, 2)
    );
    console.log(`✅ Exported ${tasks.length} tasks`);

    // Export Documents
    console.log('Exporting Documents...');
    const documents = await prisma.document.findMany();
    fs.writeFileSync(
      path.join(exportPath, 'documents.json'),
      JSON.stringify(documents, null, 2)
    );
    console.log(`✅ Exported ${documents.length} documents`);

    // Export User Profile data
    console.log('Exporting User Profile...');
    const users = await prisma.user.findMany();
    fs.writeFileSync(
      path.join(exportPath, 'users.json'),
      JSON.stringify(users, null, 2)
    );
    console.log(`✅ Exported ${users.length} users`);

    // Create a summary file
    const summary = {
      exportDate: new Date().toISOString(),
      database: 'SQLite',
      counts: {
        savedHomes: savedHomes.length,
        showingRequests: showingRequests.length,
        offers: offers.length,
        transactions: transactions.length,
        tasks: tasks.length,
        documents: documents.length,
        users: users.length,
      },
      totalRecords:
        savedHomes.length +
        showingRequests.length +
        offers.length +
        transactions.length +
        tasks.length +
        documents.length +
        users.length,
    };

    fs.writeFileSync(
      path.join(exportPath, 'export-summary.json'),
      JSON.stringify(summary, null, 2)
    );

    console.log('\n📊 Export Summary:');
    console.log('================');
    console.log(`Total Records: ${summary.totalRecords}`);
    console.log(`Saved Homes: ${summary.counts.savedHomes}`);
    console.log(`Showing Requests: ${summary.counts.showingRequests}`);
    console.log(`Offers: ${summary.counts.offers}`);
    console.log(`Transactions: ${summary.counts.transactions}`);
    console.log(`Tasks: ${summary.counts.tasks}`);
    console.log(`Documents: ${summary.counts.documents}`);
    console.log(`Users: ${summary.counts.users}`);
    console.log('\n✅ Export completed successfully!');
    console.log(`📁 Data exported to: ${exportPath}`);
  } catch (error) {
    console.error('❌ Error during export:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

exportData();
