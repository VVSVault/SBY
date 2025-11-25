import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // TODO: Get authenticated user (for now, using mock user)
    const mockUserId = 'user-1';

    const savedHomes = await prisma.savedHome.findMany({
      where: {
        userId: mockUserId,
      },
      orderBy: {
        savedAt: 'desc',
      },
    });

    return NextResponse.json({
      success: true,
      savedHomes,
    });
  } catch (error) {
    console.error('Error fetching saved homes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch saved homes' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // TODO: Get authenticated user (for now, using mock user)
    const mockUserId = 'user-1';

    const body = await request.json();
    const { listingId, notes } = body;

    if (!listingId) {
      return NextResponse.json(
        { error: 'Listing ID is required' },
        { status: 400 }
      );
    }

    // Check if already saved
    const existing = await prisma.savedHome.findUnique({
      where: {
        userId_listingId: {
          userId: mockUserId,
          listingId,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Home already saved' },
        { status: 400 }
      );
    }

    const savedHome = await prisma.savedHome.create({
      data: {
        userId: mockUserId,
        listingId,
        notes: notes || null,
      },
    });

    return NextResponse.json({
      success: true,
      savedHome,
    });
  } catch (error) {
    console.error('Error saving home:', error);
    return NextResponse.json(
      { error: 'Failed to save home' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // TODO: Get authenticated user (for now, using mock user)
    const mockUserId = 'user-1';

    const { searchParams } = new URL(request.url);
    const listingId = searchParams.get('listingId');

    if (!listingId) {
      return NextResponse.json(
        { error: 'Listing ID is required' },
        { status: 400 }
      );
    }

    await prisma.savedHome.delete({
      where: {
        userId_listingId: {
          userId: mockUserId,
          listingId,
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Home removed from saved',
    });
  } catch (error) {
    console.error('Error removing saved home:', error);
    return NextResponse.json(
      { error: 'Failed to remove saved home' },
      { status: 500 }
    );
  }
}
