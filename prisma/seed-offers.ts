import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const mockUserId = 'user-1';

  // 1. ACCEPTED OFFER - Strong offer on desirable property
  const acceptedOffer = await prisma.offer.create({
    data: {
      userId: mockUserId,
      listingId: 'listing-1', // Assuming this is the first listing
      status: 'accepted',
      offerPrice: 435000, // Offered asking price
      earnestMoney: 10000, // Good faith deposit
      financingType: 'conventional',
      downPaymentPercent: 20,
      preApproved: true,
      inspectionContingency: true,
      inspectionDays: 10,
      appraisalContingency: true,
      appraisalDays: 10,
      financingContingency: true,
      financingDays: 21,
      targetClosingDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days out
      sellerConcessions: null,
      additionalTerms: 'Congratulations! Your offer has been accepted. Next steps:\n\n1. Schedule home inspection within 10 days\n2. Secure financing approval within 21 days\n3. Complete appraisal within 10 days\n4. Work with your agent to finalize closing details\n5. Prepare for closing on the target date\n\nYour earnest money deposit of $10,000 will be held in escrow.',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    },
  });

  // 2. COUNTERED OFFER - Seller wants better terms
  const counteredOffer = await prisma.offer.create({
    data: {
      userId: mockUserId,
      listingId: 'listing-2',
      status: 'countered',
      offerPrice: 315000, // Offered below asking ($325,000)
      earnestMoney: 5000,
      financingType: 'fha',
      downPaymentPercent: 3.5,
      preApproved: true,
      inspectionContingency: true,
      inspectionDays: 14,
      appraisalContingency: true,
      appraisalDays: 14,
      financingContingency: true,
      financingDays: 30,
      targetClosingDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days out
      sellerConcessions: 'Requesting $5,000 towards closing costs',
      additionalTerms: 'Seller has countered your offer:\n\n📋 COUNTER-OFFER TERMS:\n• Price: $322,000 (You offered $315,000)\n• Closing cost assistance: $2,500 (You requested $5,000)\n• Inspection period: 10 days (You requested 14)\n• Closing date: 45 days (You requested 60)\n\n⏰ RESPONSE DEADLINE: You have 48 hours to accept, reject, or counter again.\n\n💡 NEXT STEPS:\n• Review counter-offer with your agent\n• Analyze the price difference vs. market value\n• Consider your budget and financing capacity\n• Decide whether to accept, counter-back, or walk away',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    },
  });

  // 3. REJECTED OFFER - Multiple offers situation
  const rejectedOffer = await prisma.offer.create({
    data: {
      userId: mockUserId,
      listingId: 'listing-3',
      status: 'rejected',
      offerPrice: 275000, // Below asking ($289,900)
      earnestMoney: 5000,
      financingType: 'conventional',
      downPaymentPercent: 10,
      preApproved: false, // Not pre-approved - weak offer
      inspectionContingency: true,
      inspectionDays: 14,
      appraisalContingency: true,
      appraisalDays: 14,
      financingContingency: true,
      financingDays: 30,
      targetClosingDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      sellerConcessions: 'Requesting $8,000 towards closing costs',
      additionalTerms: 'Your offer was not accepted by the seller.\n\n❌ REJECTION REASONS:\n• Property received multiple offers\n• Seller accepted a stronger competing offer\n• Your offer was below asking price without pre-approval\n• Requested concessions were too high for seller\n\n💡 LESSONS LEARNED:\n• Get pre-approved before making offers on competitive properties\n• Consider offering closer to asking price in hot markets\n• Reduce contingencies and concessions to strengthen offer\n• Act quickly when you find a property you love\n\n🏠 NEXT STEPS:\n• Continue your property search\n• Get mortgage pre-approval to strengthen future offers\n• Review comparable sales with your agent\n• Consider expanding your search criteria',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    },
  });

  // 4. WITHDRAWN OFFER - Buyer found issues during due diligence
  const withdrawnOffer = await prisma.offer.create({
    data: {
      userId: mockUserId,
      listingId: 'listing-4',
      status: 'withdrawn',
      offerPrice: 385000, // At asking price
      earnestMoney: 8000,
      financingType: 'conventional',
      downPaymentPercent: 15,
      preApproved: true,
      inspectionContingency: true,
      inspectionDays: 10,
      appraisalContingency: true,
      appraisalDays: 10,
      financingContingency: true,
      financingDays: 21,
      targetClosingDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
      sellerConcessions: null,
      additionalTerms: 'You withdrew this offer during the inspection period.\n\n🔍 REASON FOR WITHDRAWAL:\nHome inspection revealed significant issues:\n• Foundation cracks requiring $15,000+ repair\n• Roof needs replacement within 2 years (~$12,000)\n• Outdated electrical panel (potential safety hazard)\n• Evidence of past water damage in basement\n\n✅ PROTECTED BY CONTINGENCIES:\n• Your inspection contingency allowed you to withdraw\n• Earnest money deposit of $8,000 has been returned\n• No financial loss from this transaction\n\n💡 KEY TAKEAWAYS:\n• Always include inspection contingency\n• Trust professional inspector findings\n• Calculate true cost including necessary repairs\n• Walking away from a bad deal is sometimes the best decision\n\n🏠 MOVING FORWARD:\n• Resume your property search\n• Look for well-maintained properties\n• Consider home warranty for future purchases\n• Keep your pre-approval active',
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    },
  });

  console.log('✅ Created sample offers:');
  console.log('  - Accepted offer:', acceptedOffer.id);
  console.log('  - Countered offer:', counteredOffer.id);
  console.log('  - Rejected offer:', rejectedOffer.id);
  console.log('  - Withdrawn offer:', withdrawnOffer.id);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
