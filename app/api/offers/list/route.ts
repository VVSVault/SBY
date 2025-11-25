import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // TODO: Get authenticated user (for now, using mock user)
    const mockUserId = 'user-1';

    // Get all offers for the user
    const offers = await prisma.offer.findMany({
      where: {
        userId: mockUserId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      offers: offers.map(offer => ({
        id: offer.id,
        listingId: offer.listingId,
        offerPrice: offer.offerPrice,
        earnestMoney: offer.earnestMoney,
        financingType: offer.financingType,
        downPaymentPercent: offer.downPaymentPercent,
        preApproved: offer.preApproved,
        inspectionContingency: offer.inspectionContingency,
        inspectionDays: offer.inspectionDays,
        appraisalContingency: offer.appraisalContingency,
        appraisalDays: offer.appraisalDays,
        financingContingency: offer.financingContingency,
        financingDays: offer.financingDays,
        targetClosingDate: offer.targetClosingDate?.toISOString() || null,
        sellerConcessions: offer.sellerConcessions,
        additionalTerms: offer.additionalTerms,
        status: offer.status,
        createdAt: offer.createdAt.toISOString(),
        updatedAt: offer.updatedAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error('Error fetching offers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch offers' },
      { status: 500 }
    );
  }
}
