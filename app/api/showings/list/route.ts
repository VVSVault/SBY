import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // TODO: Get authenticated user (for now, using mock user)
    const mockUserId = 'user-1';

    // Get all showing requests for the user
    const showings = await prisma.showingRequest.findMany({
      where: {
        userId: mockUserId,
      },
      orderBy: {
        preferredDate: 'asc',
      },
    });

    console.log('Raw showings from DB:', JSON.stringify(showings, null, 2));

    return NextResponse.json({
      showings: showings.map(showing => ({
        id: showing.id,
        listingId: showing.listingId,
        preferredDate: showing.preferredDate.toISOString(),
        preferredTime: showing.preferredTime || '',
        note: showing.note || '',
        status: showing.status,
        cancellationReason: showing.cancellationReason || null,
        showingNotes: showing.showingNotes || null,
        createdAt: showing.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error('Error fetching showing requests:', error);
    return NextResponse.json(
      { error: 'Failed to fetch showing requests' },
      { status: 500 }
    );
  }
}
