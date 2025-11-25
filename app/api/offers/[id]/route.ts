import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    // TODO: Get authenticated user (for now, using mock user)
    const mockUserId = 'user-1';

    // Get offer by ID
    const offer = await prisma.offer.findFirst({
      where: {
        id,
        userId: mockUserId, // Ensure user owns this offer
      },
    });

    if (!offer) {
      return NextResponse.json(
        { error: 'Offer not found or unauthorized' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      offer: {
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
      },
    });
  } catch (error) {
    console.error('Error fetching offer:', error);
    return NextResponse.json(
      { error: 'Failed to fetch offer' },
      { status: 500 }
    );
  }
}

const updateOfferSchema = z.object({
  status: z.enum(['draft', 'submitted', 'accepted', 'rejected', 'countered', 'withdrawn']).optional(),
  offerPrice: z.number().min(1000).optional(),
  earnestMoney: z.number().min(0).optional(),
  financingType: z.enum(['cash', 'conventional', 'fha', 'va', 'other']).optional(),
  downPaymentPercent: z.number().min(0).max(100).optional().nullable(),
  preApproved: z.boolean().optional(),
  inspectionContingency: z.boolean().optional(),
  inspectionDays: z.number().min(0).max(30).optional().nullable(),
  appraisalContingency: z.boolean().optional(),
  appraisalDays: z.number().min(0).max(30).optional().nullable(),
  financingContingency: z.boolean().optional(),
  financingDays: z.number().min(0).max(45).optional().nullable(),
  targetClosingDate: z.string().optional().nullable(),
  sellerConcessions: z.string().max(500).optional().nullable(),
  additionalTerms: z.string().max(1000).optional().nullable(),
});

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();

    // Validate request body
    const validatedData = updateOfferSchema.parse(body);

    // TODO: Get authenticated user (for now, using mock user)
    const mockUserId = 'user-1';

    // Check if offer exists and user owns it
    const existingOffer = await prisma.offer.findFirst({
      where: {
        id,
        userId: mockUserId,
      },
    });

    if (!existingOffer) {
      return NextResponse.json(
        { error: 'Offer not found or unauthorized' },
        { status: 404 }
      );
    }

    // Transform data for database
    const updateData: any = { ...validatedData };
    if (validatedData.targetClosingDate !== undefined) {
      updateData.targetClosingDate = validatedData.targetClosingDate
        ? new Date(validatedData.targetClosingDate)
        : null;
    }

    // Update offer
    const updatedOffer = await prisma.offer.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      offer: {
        id: updatedOffer.id,
        listingId: updatedOffer.listingId,
        offerPrice: updatedOffer.offerPrice,
        earnestMoney: updatedOffer.earnestMoney,
        financingType: updatedOffer.financingType,
        downPaymentPercent: updatedOffer.downPaymentPercent,
        preApproved: updatedOffer.preApproved,
        inspectionContingency: updatedOffer.inspectionContingency,
        inspectionDays: updatedOffer.inspectionDays,
        appraisalContingency: updatedOffer.appraisalContingency,
        appraisalDays: updatedOffer.appraisalDays,
        financingContingency: updatedOffer.financingContingency,
        financingDays: updatedOffer.financingDays,
        targetClosingDate: updatedOffer.targetClosingDate?.toISOString() || null,
        sellerConcessions: updatedOffer.sellerConcessions,
        additionalTerms: updatedOffer.additionalTerms,
        status: updatedOffer.status,
        createdAt: updatedOffer.createdAt.toISOString(),
        updatedAt: updatedOffer.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    console.error('Error updating offer:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update offer' },
      { status: 500 }
    );
  }
}
